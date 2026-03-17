// TitleSlide - Header/Title slide with event name and date
// Matches Figma "Header" section design

import SlideWrapper from './SlideWrapper';

export default function TitleSlide({ eventName, eventDate }) {
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds !== undefined) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <SlideWrapper noPadding className="relative">
      <div className="flex flex-col items-center justify-center min-h-[800px] relative w-full">
        {/* Background floral image */}
        <div className="absolute inset-0 opacity-50 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            src="/presentation/header-bg.png"
          />
        </div>

        {/* Title card */}
        <div className="bg-white border-6 border-[#055e5a] border-solid flex flex-col gap-[24px] items-center px-[60px] py-[45px] relative w-[800px] text-center">
          <p className="font-['EB_Garamond',serif] text-[#333] text-[48px] w-full">
            {eventName || 'Your Special Event'}
          </p>
          <p className="font-['Nunito_Sans',sans-serif] text-[18px] text-black w-full">
            {formatDate(eventDate)}
          </p>
        </div>
      </div>
    </SlideWrapper>
  );
}
