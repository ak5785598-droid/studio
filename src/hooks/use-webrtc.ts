
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp,
  addDoc,
  doc
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

/**
 * PRODUCTION WEBRTC HOOK
 * Handles P2P Audio Mesh via Firestore Signaling.
 * Synchronized with tribal security protocols.
 * Allows Listeners (seatIndex 0) to hear Speakers (seatIndex > 0).
 */
export function useWebRTC(roomId: string | undefined, isInSeat: boolean, isMuted: boolean) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  
  const iceConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // 1. Local Stream Management
  useEffect(() => {
    if (!isInSeat || !user || !roomId || !firestore) {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        setLocalStream(null);
      }
      return;
    }

    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getAudioTracks().forEach(track => {
          track.enabled = !isMuted;
        });
        setLocalStream(stream);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          toast({
            variant: 'destructive',
            title: 'Microphone Denied',
            description: 'Enable permissions to speak in the frequency.',
          });
        }
      }
    };

    startLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isInSeat, roomId, user?.uid]);

  // Sync mute state to local stream tracks
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  // 2. Global Mesh & Signaling
  useEffect(() => {
    if (!user || !roomId || !firestore) return;

    const participantsRef = collection(firestore, 'chatRooms', roomId, 'participants');
    
    // Listen for other participants to connect
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const peerId = change.doc.id;
        if (peerId === user.uid) return;

        const peerData = change.doc.data();
        const isPeerSpeaker = peerData.seatIndex > 0;
        
        // Protocol: Connections are made if AT LEAST one side is a speaker
        if (isPeerSpeaker || isInSeat) {
          if (change.type === 'added' || change.type === 'modified') {
            if (!peerConnections.current.has(peerId)) {
              initiateConnection(peerId);
            }
          }
        } else if (change.type === 'removed') {
          closeConnection(peerId);
        }
      });
    });

    // Signaling Listener for incoming handshakes
    const signalingRef = collection(firestore, 'chatRooms', roomId, 'participants', user.uid, 'signaling');
    const unsubSignaling = onSnapshot(signalingRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const signal = change.doc.data();
          handleSignal(signal);
          await deleteDoc(change.doc.ref);
        }
      });
    });

    return () => {
      unsubscribe();
      unsubSignaling();
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      setRemoteStreams(new Map());
    };
  }, [roomId, user?.uid, isInSeat]);

  // 3. Connection Helpers
  const initiateConnection = async (peerId: string) => {
    if (!user || !roomId || !firestore) return;

    const pc = new RTCPeerConnection(iceConfig);
    peerConnections.current.set(peerId, pc);

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(peerId, { type: 'candidate', candidate: event.candidate.toJSON(), from: user.uid });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => {
        const next = new Map(prev);
        next.set(peerId, event.streams[0]);
        return next;
      });
    };

    // Smaller UID offers to ensure single connection in P2P mesh
    if (user.uid < peerId) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal(peerId, { type: 'offer', sdp: offer.sdp, from: user.uid });
      } catch (e) {}
    }
  };

  const handleSignal = async (signal: any) => {
    if (!user) return;
    const peerId = signal.from;
    let pc = peerConnections.current.get(peerId);

    if (!pc) {
      pc = new RTCPeerConnection(iceConfig);
      peerConnections.current.set(peerId, pc);
      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }
      pc.onicecandidate = (event) => {
        if (event.candidate) sendSignal(peerId, { type: 'candidate', candidate: event.candidate.toJSON(), from: user.uid });
      };
      pc.ontrack = (event) => {
        setRemoteStreams(prev => {
          const next = new Map(prev);
          next.set(peerId, event.streams[0]);
          return next;
        });
      };
    }

    try {
      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signal.sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal(peerId, { type: 'answer', sdp: answer.sdp, from: user.uid });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signal.sdp }));
      } else if (signal.type === 'candidate') {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (e) {}
  };

  const sendSignal = (toPeerId: string, payload: any) => {
    if (!firestore || !roomId) return;
    const ref = collection(firestore, 'chatRooms', roomId, 'participants', toPeerId, 'signaling');
    addDoc(ref, { ...payload, timestamp: serverTimestamp() });
  };

  const closeConnection = (peerId: string) => {
    const pc = peerConnections.current.get(peerId);
    pc?.close();
    peerConnections.current.delete(peerId);
    setRemoteStreams(prev => {
      const next = new Map(prev);
      next.delete(peerId);
      return next;
    });
  };

  return { localStream, remoteStreams };
}
