'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UmmyLogoIcon } from '@/components/icons';
import { FcGoogle } from 'react-icons/fc';
import { Loader, Phone, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
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

/**
 * Universal Identity Portal - Welcome Edition.
 * Optimized for high-speed sign-in and elite onboarding.
 */
export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [phoneLoginStep, setPhoneLoginStep] = useState<'number' | 'code'>(
    'number'
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/rooms');
      const fallbackTimer = setTimeout(() => {
        if (window.location.pathname === '/login') {
          window.location.href = '/rooms';
        }
      }, 1000);
      return () => clearTimeout(fallbackTimer);
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
      toast({ title: 'Code Sent', description: 'Verification frequency dispatched via SMS.' });
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
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#FFCC00]">
        <UmmyLogoIcon className="h-24 w-24 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-background p-6 text-foreground font-sans overflow-y-auto no-scrollbar">
      <div id="recaptcha-container"></div>
      
      <div className="flex flex-col items-center text-center space-y-4 mb-10 animate-in fade-in duration-1000">
        <UmmyLogoIcon className="h-24 w-24 drop-shadow-xl" />
        <div className="space-y-1">
          <h1 className="font-headline text-5xl font-black italic uppercase tracking-tighter text-[#FFCC00] drop-shadow-sm">
            Welcome to Ummy
          </h1>
          <p className="text-muted-foreground font-body text-sm uppercase tracking-widest opacity-60">
            Join the High-Fidelity Vibe
          </p>
        </div>
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 max-w-xs">
           <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
             Connect with your tribe in real-time voice frequencies. Launch your identity and ascend the rankings.
           </p>
        </div>
      </div>

      <div className="w-full max-sm space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
        {phoneLoginStep === 'number' ? (
           <>
            <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 justify-center gap-4 bg-white text-black hover:bg-gray-50 border-2 rounded-2xl font-black uppercase italic transition-all shadow-md"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                >
                  <FcGoogle className="h-6 w-6" />
                  Continue with Google
                </Button>
            </div>

            <div className="relative flex items-center gap-4 py-2">
              <span className="flex-1 border-t border-gray-100" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Or Use SMS Gateway</span>
              <span className="flex-1 border-t border-gray-100" />
            </div>

            <div className="space-y-3">
                <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isSigningIn}
                      className="h-14 pl-10 text-lg rounded-2xl border-2 focus:border-[#FFCC00] transition-all"
                   />
                </div>
                <Button onClick={handlePhoneSignIn} disabled={isSigningIn || !phoneNumber} className="w-full h-14 text-sm font-black uppercase italic rounded-2xl bg-[#FFCC00] text-white shadow-lg">
                    {isSigningIn ? <Loader className="h-5 w-5 animate-spin" /> : 'Request OTP'}
                </Button>
            </div>
          </>
        ) : (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-1">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Verifying Identity</p>
                   <p className="text-[10px] text-muted-foreground italic">Sent to {phoneNumber}</p>
                </div>
                <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={isSigningIn}
                    className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-2 focus:border-[#FFCC00]"
                    maxLength={6}
                />
                <Button onClick={handleVerifyCode} disabled={isSigningIn || !verificationCode} className="w-full h-14 text-lg font-black uppercase italic rounded-2xl bg-[#FFCC00] text-white shadow-lg">
                    {isSigningIn ? <Loader className="h-5 w-5 animate-spin" /> : 'Enter Ummy'}
                </Button>
                <button onClick={() => setPhoneLoginStep('number')} className="w-full text-muted-foreground font-black uppercase text-[8px] tracking-[0.2em] hover:text-foreground transition-colors">
                    Re-enter Number?
                </button>
            </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 text-center">
         <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#FFCC00]" />
            <span>Encrypted Tribal Connection</span>
         </div>
         <p className="text-[9px] text-muted-foreground leading-relaxed max-w-[220px] uppercase font-bold tracking-tighter">
            By continuing, you agree to join the official Ummy social graph. <Link href="/help-center" className="underline text-foreground">Protocol Details</Link>.
         </p>
      </div>
    </div>
  );
}
