'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UmmyLogoIcon } from '@/components/icons';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { Loader, Phone, ShieldCheck, Smartphone, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * High-Fidelity Identity Portal.
 * Redesigned to mirror the requested blueprint with vibrant neon backgrounds and glassmorphism.
 */
export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phoneLoginStep, setPhoneLoginStep] = useState<'number' | 'code'>('number');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/rooms');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'Could not sign in with Google.',
        });
      }
    } finally {
      setIsSigningIn(false);
    }
  };
  
  const handlePhoneSignIn = async () => {
    if (!auth) return;
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      toast({ variant: 'destructive', title: 'Invalid Number', description: 'Enter full number with country code.' });
      return;
    }
    setIsSigningIn(true);
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const verifier = (window as any).recaptchaVerifier;
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, verifier);
      setConfirmationResult(result);
      setPhoneLoginStep('code');
      toast({ title: 'Code Sent', description: 'Verification dispatched via SMS.' });
    } catch (error: any) {
      (window as any).recaptchaVerifier = null;
      toast({ variant: 'destructive', title: 'Failed', description: error.message });
    } finally {
      setIsSigningIn(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    setIsSigningIn(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast({ title: 'Identity Verified', description: 'Synchronizing with tribal graph...' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Invalid Code', description: 'Incorrect verification code.' });
    } finally {
        setIsSigningIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black">
        <UmmyLogoIcon className="h-24 w-24 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between p-8 pb-12 pt-20 overflow-hidden font-headline">
      <div id="recaptcha-container"></div>
      
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        {loginBg && (
          <Image 
            src={loginBg.imageUrl} 
            fill 
            className="object-cover scale-110 blur-[2px]" 
            alt="Vibe Background" 
            data-ai-hint={loginBg.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-black/80" />
      </div>

      {/* Top Identity Block */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-1000">
        <div className="relative h-32 w-32 mb-2">
           <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
           <UmmyLogoIcon className="h-full w-full drop-shadow-2xl relative z-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
            Ummy
          </h1>
          <p className="text-white/80 font-body text-xl tracking-tight">
            Connect & vibe with your tribe
          </p>
        </div>
      </div>

      {/* Main Authentication Dimension */}
      <div className="w-full max-w-sm space-y-6 relative z-10">
        {!showPhoneLogin ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Solid High-Visibility Buttons */}
            <Button
              className="w-full h-14 justify-center gap-4 bg-[#1877F2] text-white hover:bg-[#166fe5] rounded-full font-black uppercase transition-all shadow-xl border-none"
              onClick={() => toast({ title: 'Facebook Sync', description: 'Portal maintenance in progress.' })}
            >
              <FaFacebookF className="h-5 w-5" />
              Facebook
            </Button>

            <Button
              className="w-full h-14 justify-center gap-4 bg-white text-black hover:bg-gray-100 rounded-full font-black uppercase transition-all shadow-xl border-none"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? <Loader className="animate-spin h-5 w-5" /> : <FcGoogle className="h-6 w-6" />}
              Sign in with Google
            </Button>

            <div className="flex items-center gap-4 py-4">
              <span className="flex-1 h-px bg-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">- or -</span>
              <span className="flex-1 h-px bg-white/20" />
            </div>

            {/* Circular Phone Icon Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => setShowPhoneLogin(true)}
                className="h-16 w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-white/20 active:scale-95 transition-all group"
              >
                <Smartphone className="h-8 w-8 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* Phone OTP Dimension - Glass Card */
          <div className="space-y-6 animate-in zoom-in duration-300 bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2 text-white/60">
                  <Phone className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Phone Entry</span>
               </div>
               <button onClick={() => setShowPhoneLogin(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {phoneLoginStep === 'number' ? (
              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSigningIn}
                  className="h-14 bg-white/10 border-white/20 text-white rounded-2xl text-center text-lg focus:ring-primary focus:border-primary placeholder:text-white/20"
                />
                <Button 
                  onClick={handlePhoneSignIn} 
                  disabled={isSigningIn || !phoneNumber} 
                  className="w-full h-14 bg-primary text-black font-black uppercase rounded-2xl shadow-xl border-none"
                >
                  {isSigningIn ? <Loader className="h-5 w-5 animate-spin" /> : 'Sync Number'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] text-white/40 text-center">Identity code sent to {phoneNumber}</p>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isSigningIn}
                  className="h-16 bg-white/10 border-white/20 text-white rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:ring-primary"
                  maxLength={6}
                />
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={isSigningIn || !verificationCode} 
                  className="w-full h-14 bg-primary text-black font-black uppercase rounded-2xl shadow-xl border-none"
                >
                  {isSigningIn ? <Loader className="h-5 w-5 animate-spin" /> : 'Enter Frequency'}
                </Button>
                <button onClick={() => setPhoneLoginStep('number')} className="w-full text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white">Back</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Dimension */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-[280px]">
         <p className="text-[10px] text-white/60 leading-relaxed font-body">
            By continuing you agree to the<br/>
            <Link href="/help-center" className="underline text-white font-black mx-1">User Agreement</Link> & <Link href="/help-center" className="underline text-white font-black">Privacy Policy</Link>
         </p>
         <div className="h-1 w-32 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}
