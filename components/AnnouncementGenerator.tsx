'use client';

import { useState, useEffect } from 'react';
import { useOperationsStore } from '../store/useOperationsStore';
import { Volume2, Copy, Check, Languages } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AnnouncementGenerator() {
  const { activeRecommendation } = useOperationsStore();
  const [activeTab, setActiveTab] = useState<'EN' | 'HI' | 'MR'>('EN');
  const [copied, setCopied] = useState(false);

  const [announcements, setAnnouncements] = useState({
    EN: 'No active delays. Waiting for telemetry updates.',
    HI: 'कोई सक्रिय देरी नहीं। टेलीमेट्री अपडेट की प्रतीक्षा है।',
    MR: 'कोणतीही सक्रिय विलंब नाही. टेलीमेट्री अपडेटची प्रतीक्षा करत आहे.'
  });

  useEffect(() => {
    if (activeRecommendation) {
      const { move_train, old_platform, new_platform } = activeRecommendation.recommended_action;
      const trainNum = move_train;
      // Get train name if possible or mock
      const trainName = activeRecommendation.event_type === 'crowd_surge' ? 'Rajdhani Express' : 'Deccan Express';
      const delay = activeRecommendation.event_type === 'delay' ? '47' : activeRecommendation.event_type === 'cascade_delay' ? '60' : '0';

      const en = activeRecommendation.event_type === 'crowd_surge'
        ? `Attention passengers on Platform ${old_platform}. Due to platform congestion, Train ${trainNum} ${trainName} will now arrive on Platform ${new_platform}. Please use the central overhead bridge to proceed to Platform ${new_platform} safely.`
        : activeRecommendation.event_type === 'medical_emergency'
        ? `Operational Alert: Platform ${old_platform} is temporarily closed for emergency medical services. Passengers are requested not to gather near the area. Train ${trainNum} ${trainName} is reassigned to Platform ${new_platform}.`
        : `May I have your attention please. Train ${trainNum}, ${trainName}, is running delayed by ${delay} minutes. It will now arrive on Platform ${new_platform} instead of Platform ${old_platform}. The inconvenience caused is deeply regretted.`;

      const hi = activeRecommendation.event_type === 'crowd_surge'
        ? `प्लेटफॉर्म ${old_platform} पर मौजूद यात्री कृपया ध्यान दें। प्लेटफॉर्म पर भीड़ के कारण, गाड़ी संख्या ${trainNum} ${trainName} अब प्लेटफॉर्म नंबर ${new_platform} पर आएगी। कृपया प्लेटफॉर्म नंबर ${new_platform} पर जाने के लिए केंद्रीय ओवरहेड ब्रिज का उपयोग करें।`
        : activeRecommendation.event_type === 'medical_emergency'
        ? `संचालन चेतावनी: आपातकालीन चिकित्सा सेवाओं के लिए प्लेटफॉर्म नंबर ${old_platform} को अस्थायी रूप से बंद कर दिया गया है। यात्रियों से अनुरोध है कि वे इस क्षेत्र में जमा न हों। गाड़ी संख्या ${trainNum} ${trainName} को प्लेटफॉर्म ${new_platform} पर पुनः आवंटित किया गया है।`
        : `यात्रियों कृपया ध्यान दें। गाड़ी संख्या ${trainNum}, ${trainName}, अपने निर्धारित समय से ${delay} मिनट की देरी से चल रही है। यह गाड़ी अब प्लेटफॉर्म नंबर ${old_platform} के बजाय प्लेटफॉर्म नंबर ${new_platform} पर आएगी। यात्रियों को हुई असुविधा के लिए हमें खेद है।`;

      const mr = activeRecommendation.event_type === 'crowd_surge'
        ? `प्लॅटफॉर्म ${old_platform} वरील प्रवासी कृपया नोंद घ्या. प्लॅटफॉर्मवरील गर्दीमुळे, गाडी क्रमांक ${trainNum} ${trainName} आता प्लॅटफॉर्म क्रमांक ${new_platform} वर येईल. कृपया प्लॅटफॉर्म क्रमांक ${new_platform} वर जाण्यासाठी मध्यवर्ती ओव्हरहेड ब्रिजचा वापर करावा.`
        : activeRecommendation.event_type === 'medical_emergency'
        ? `ऑपरेशनल अलर्ट: प्लॅटफॉर्म क्रमांक ${old_platform} तातडीच्या वैद्यकीय सेवांसाठी तात्पुरता बंद करण्यात आला आहे. प्रवाशांना विनंती आहे की त्यांनी त्या भागात गर्दी करू नये. गाडी क्रमांक ${trainNum} ${trainName} प्लॅटफॉर्म क्रमांक ${new_platform} वर पुनर्नियुक्त करण्यात आली आहे.`
        : `प्रवासी कृपया नोंद घ्या. गाडी क्रमांक ${trainNum}, ${trainName}, तिच्या वेळेपेक्षा ${delay} मिनिटे उशिराने धावत आहे. ही गाडी आता प्लॅटफॉर्म क्रमांक ${old_platform} ऐवजी प्लॅटफॉर्म क्रमांक ${new_platform} वर येईल. प्रवाशांना होणाऱ्या गैरसोयीबद्दल आम्ही दिलगीर आहोत.`;

      setAnnouncements({ EN: en, HI: hi, MR: mr });
    } else {
      setAnnouncements({
        EN: 'No active alerts. Operational intelligence status is clear.',
        HI: 'कोई सक्रिय अलर्ट नहीं। परिचालन खुफिया स्थिति स्पष्ट है।',
        MR: 'कोणतीही सक्रिय अलर्ट नाही. ऑपरेशन्स इंटेलिजन्स स्टेटस स्पष्ट आहे.'
      });
    }
  }, [activeRecommendation]);

  const copyToClipboard = async () => {
    const textToCopy = announcements[activeTab];
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm flex flex-col gap-5 premium-card-shadow transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/55 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text-primary">
              Announcement Generator
            </h3>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mt-0.5">
              Synthesized Audio Broadcast Engine
            </p>
          </div>
        </div>
        <Languages className="h-4.5 w-4.5 text-text-secondary" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 text-2xs font-mono font-bold tracking-wide">
        {(['EN', 'HI', 'MR'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 border-b-2 font-bold transition-colors cursor-pointer",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab === 'EN' ? 'ENGLISH (EN)' : tab === 'HI' ? 'हिन्दी (HI)' : 'मराठी (MR)'}
          </button>
        ))}
      </div>

      {/* Script Box */}
      <div className="relative border border-border/80 rounded-xl bg-secondary-bg/25 p-4 min-h-[105px] flex items-center justify-between transition-all duration-200">
        <p className="text-[11.5px] text-text-primary leading-relaxed font-sans pr-10">
          {announcements[activeTab]}
        </p>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          disabled={!activeRecommendation}
          className={cn(
            "absolute right-3 top-3 h-8 w-8 flex items-center justify-center rounded-lg border border-border/80 bg-card hover:bg-hover-surface transition-all duration-200 cursor-pointer text-text-secondary hover:text-text-primary",
            !activeRecommendation && "opacity-30 cursor-not-allowed"
          )}
          title="Copy Announcement"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[9px] text-text-secondary font-mono uppercase tracking-wider font-bold">
        <span>BROADCAST TYPE: SYNTHESIZED TEXT-TO-SPEECH</span>
        <span>STATUS: READY</span>
      </div>
    </div>
  );
}
