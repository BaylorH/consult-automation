// SlideWrapper - Consistent slide sizing and styling for presentation
// Uses MacBook Air dimensions from Figma design (1440px width)

export default function SlideWrapper({ children, className = '', noPadding = false, bgColor = 'bg-white' }) {
  // Allow className to override bgColor by checking if it contains a bg- class
  const hasBgClass = className.includes('bg-');
  const bgClass = hasBgClass ? '' : bgColor;

  return (
    <div
      className={`w-full max-w-[1440px] mx-auto ${bgClass} ${noPadding ? '' : 'px-[30px] py-[60px]'} ${className}`}
    >
      {children}
    </div>
  );
}
