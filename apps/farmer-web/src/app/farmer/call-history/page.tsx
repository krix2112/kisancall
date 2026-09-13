'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FarmerHeader from '@/components/farmer/FarmerHeader';

interface CallRecord {
  id: string;
  topic: string;
  topicHindi: string;
  date: string;
  time: string;
  duration: string;
  type: 'resolved' | 'missed' | 'followup';
  summary: string;
  fullTranscript: string;
  audioDurationSec: number;
  badge: string;
}

const CALLS_DATA: CallRecord[] = [
  {
    id: 'KC-CALL-9821',
    topic: 'Payment Credit Confirmation',
    topicHindi: 'डीबीटी भुगतान जमा सूचना',
    date: 'आज • 05 Sep 2026',
    time: '11:42 AM',
    duration: '1 मिनट 24 सेकंड',
    type: 'resolved',
    summary: 'किसान कॉल सेंटर स्वचालित वॉयसबॉट ने ₹1,11,475 का भुगतान सीधे एसबीआई खाते में जमा होने की पुष्टि की।',
    fullTranscript: 'नमस्कार रमेश जी, किसान कॉल सेवा से सूचना: आपकी गेहूं खरीद का कुल 1,11,475 रुपये आज सुबह 11:42 बजे आपके स्टेट बैंक खाते में डीबीटी द्वारा जमा कर दिया गया है। पर्ची संख्या MP-SHR-2026-901 है। किसी भी सहायता के लिए पुनः 1800-180-1551 पर कॉल करें।',
    audioDurationSec: 84,
    badge: 'भुगतान सफल',
  },
  {
    id: 'KC-CALL-9815',
    topic: 'Weighbridge Gross-Tare Slip',
    topicHindi: 'धर्मकांटा तौल रसीद पुष्टि',
    date: 'आज • 05 Sep 2026',
    time: '10:20 AM',
    duration: '2 मिनट 10 सेकंड',
    type: 'resolved',
    summary: 'तौल कांटा नंबर 4 पर 45.50 क्विंटल शुद्ध गेहूं तौल पास होने और नमी 10.4% दर्ज होने की जानकारी।',
    fullTranscript: 'रमेश जी, आपका ट्रैक्टर HR-05-AB-9821 कांटा नंबर 4 पर तौला जा चुका है। सकल वजन 78.40 क्विंटल, खाली ट्रैक्टर 29.80 क्विंटल और शुद्ध गेहूं 45.50 क्विंटल दर्ज हुआ है। नमी 10.4 प्रतिशत पाई गई है।',
    audioDurationSec: 130,
    badge: 'तौल पूर्ण',
  },
  {
    id: 'KC-CALL-9790',
    topic: 'Live Queue & Gate Entry Alert',
    topicHindi: 'मंडी गेट टोकन व कतार अलर्ट',
    date: 'कल • 04 Sep 2026',
    time: '04:15 PM',
    duration: '45 सेकंड',
    type: 'resolved',
    summary: 'कल सुबह 10:00 बजे स्लॉट के लिए टोकन K-104 आवंटित होने और समय पर मंडी पहुंचने का अनुस्मारक।',
    fullTranscript: 'नमस्कार, सीहोर मंडी में आपकी कल की स्लॉट बुकिंग पक्की हो गई है। गेट पास टोकन K-104 है। कृपया कल सुबह 10:00 बजे गेट नंबर 2 पर रिपोर्ट करें।',
    audioDurationSec: 45,
    badge: 'स्लॉट कन्फर्म',
  },
  {
    id: 'KC-CALL-9762',
    topic: 'Missed Slot Followup Call',
    topicHindi: 'छूटा हुआ वॉयस कॉल',
    date: '03 Sep 2026',
    time: '02:30 PM',
    duration: '0 सेकंड (Missed)',
    type: 'missed',
    summary: 'मौसम अलर्ट और मंडी आवक समय निर्धारण से संबंधित स्वचालित कॉल जो नेटवर्क समस्या के कारण नहीं उठ सकी।',
    fullTranscript: 'कॉल छूट गई: सीहोर क्षेत्र में बारिश की संभावना के कारण मंडी शेड व्यवस्था की सूचना दी जानी थी।',
    audioDurationSec: 0,
    badge: 'छूट गई',
  },
  {
    id: 'KC-CALL-9741',
    topic: 'Aadhaar Bank NPCI Mapping',
    topicHindi: 'आधार बैंक मैपिंग सत्यापन',
    date: '02 Sep 2026',
    time: '12:10 PM',
    duration: '3 मिनट 15 सेकंड',
    type: 'followup',
    summary: 'डीबीटी भुगतान के लिए आधार बैंक लिंकिंग स्टेटस जांचने हेतु किसान कॉल ऑपरेटर से वार्ता।',
    fullTranscript: 'किसान कॉल प्रतिनिधि: रमेश जी, आपके बैंक खाते का डीबीटी स्टेटस जांचा जा रहा है। यदि खाते में कोई रुकावट आए तो अपनी शाखा में जाकर ई-केवाईसी पुनः सत्यापित करवा लें।',
    audioDurationSec: 195,
    badge: 'सत्यापन जारी',
  },
  {
    id: 'KC-CALL-9705',
    topic: 'Wheat MSP Price Inquiry',
    topicHindi: 'गेहूं न्यूनतम समर्थन मूल्य पूछताछ',
    date: '01 Sep 2026',
    time: '09:05 AM',
    duration: '1 मिनट 50 सेकंड',
    type: 'resolved',
    summary: 'किसान ने आगामी रबी सत्र हेतु गेहूं का सरकारी समर्थन मूल्य ₹2,400 और मंडी बोनस के संबंध में जानकारी ली।',
    fullTranscript: 'किसान: नमस्कार साहब, इस बार गेहूं का समर्थन मूल्य क्या तय हुआ है? ऑपरेटर: रमेश जी, केंद्र सरकार ने 2025-26 सत्र हेतु ₹2,400 प्रति क्विंटल एमएसपी तय किया है, और सीहोर मंडी में औसत बोली ₹2,450 तक जा रही है।',
    audioDurationSec: 110,
    badge: 'जानकारी दी गई',
  },
];

export default function FarmerCallHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'missed' | 'followup'>('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredCalls = CALLS_DATA.filter((call) => {
    if (filter === 'missed') return call.type === 'missed';
    if (filter === 'followup') return call.type === 'followup';
    return true;
  });

  const handlePlayVoice = (call: CallRecord) => {
    if (playingId === call.id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(call.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(call.fullTranscript);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbf1] text-slate-900 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <FarmerHeader
        title="कॉल इतिहास"
        subtitle="Call History Records • KisanCall Voice Log"
        showBack={true}
        audioText="किसान कॉल सेंटर के साथ आपकी कुल 6 आवाज़ी बातचीत दर्ज हैं, जिनमें 5 हल हो चुकी हैं और 1 फॉलोअप में है।"
      />

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col gap-3.5">
        
        {/* Voice Assurance Summary Banner */}
        <section className="rounded-2xl bg-white p-4 shadow-xs border border-stone-200/80 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
              🎙️
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900">आवाज़ी बातचीत का सुरक्षित खाता</h2>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug font-hindi">
                सभी कॉल कृषि मंत्रालय के किसान कॉल सेंटर (1800-180-1551) द्वारा सत्यापित हैं।
              </p>
            </div>
          </div>

          {/* Quick Counter Chips */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
              <span className="block text-[10px] text-stone-500 font-bold uppercase">कुल कॉल</span>
              <strong className="text-xs text-slate-900 font-mono">6 Calls</strong>
            </div>
            <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              <span className="block text-[10px] text-emerald-800 font-bold uppercase">हल हुई</span>
              <strong className="text-xs text-[#00450d] font-mono">5 Resolved</strong>
            </div>
            <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span className="block text-[10px] text-amber-800 font-bold uppercase">अनुवर्ती</span>
              <strong className="text-xs text-amber-900 font-mono">1 Followup</strong>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="w-full bg-[#e8ede2] p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#00450d] shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            सभी कॉल (6)
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              filter === 'missed'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            छूट गई (1)
          </button>
          <button
            onClick={() => setFilter('followup')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              filter === 'followup'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            कार्रवाई आवश्यक (1)
          </button>
        </div>

        {/* Call Feed */}
        <div className="space-y-3">
          {filteredCalls.map((call) => {
            const isPlaying = playingId === call.id;

            return (
              <article
                key={call.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 flex flex-col gap-2.5 transition-all hover:border-emerald-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                        call.type === 'resolved'
                          ? 'bg-emerald-50 text-[#00450d] border border-emerald-200'
                          : call.type === 'missed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {call.type === 'resolved' ? '📞' : call.type === 'missed' ? '📵' : '⚠️'}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {call.topicHindi}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {call.date} • {call.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      call.type === 'resolved'
                        ? 'bg-emerald-100 text-emerald-900'
                        : call.type === 'missed'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {call.badge}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-hindi bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                  {call.summary}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => handlePlayVoice(call)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-emerald-700 text-white animate-pulse'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#00450d] border border-emerald-200'
                    }`}
                    type="button"
                  >
                    <span>{isPlaying ? '⏹️ बंद करें' : '▶️ रिकॉर्डिंग सुनें'}</span>
                    <span className="text-[10px] opacity-75">({call.duration})</span>
                  </button>

                  <button
                    onClick={() => setSelectedCall(call)}
                    className="text-stone-600 hover:text-slate-900 font-bold text-xs px-2 py-1 underline cursor-pointer"
                    type="button"
                  >
                    पूर्ण विवरण (Details)
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Persistent Call Center Help Card */}
        <a
          href="tel:18001801551"
          className="w-full bg-[#202720] hover:bg-[#151c15] text-white rounded-2xl py-3.5 px-4 flex items-center justify-between shadow-sm transition-colors mt-2"
        >
          <div className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
              📞
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">किसान हेल्पलाइन से बात करें</div>
              <div className="text-[10px] text-stone-300 font-hindi">निशुल्क नंबर पर तुरंत ऑपरेटर से जुड़ें</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/15 px-2.5 py-1 rounded-lg text-white">
            1800-180-1551
          </span>
        </a>

      </main>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCall.topicHindi}</h3>
                <p className="text-xs text-stone-500 font-mono">{selectedCall.id} • {selectedCall.date}</p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase text-[10px]">कॉल समय</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedCall.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase text-[10px]">अवधि</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedCall.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase text-[10px]">स्थिति</span>
                  <span className="font-bold text-emerald-800">{selectedCall.badge}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  आधिकारिक संवाद विवरण (Full Transcript)
                </h4>
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 font-hindi leading-relaxed text-slate-800 text-xs">
                  {selectedCall.fullTranscript}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePlayVoice(selectedCall)}
                  className="flex-1 py-3 bg-[#00450d] hover:bg-[#134717] text-white rounded-xl font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span>🔊 ऑडियो सुनें (Play Recording)</span>
                </button>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  type="button"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
