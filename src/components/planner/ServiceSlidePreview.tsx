import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';
import type { ServiceItem } from '../../types/service';

interface ServiceSlidePreviewProps {
  item: ServiceItem;
  className?: string;
}

export function ServiceSlidePreview({ item, className = '' }: ServiceSlidePreviewProps) {
  const background = item.backgroundId 
    ? WORSHIP_BACKGROUNDS.find(bg => bg.id === item.backgroundId)
    : null;

  const textColorClass = item.textColor === 'dark' ? 'text-black' : 'text-white';
  const shadowClass = item.textColor === 'dark' ? 'drop-shadow-md' : 'drop-shadow-lg';

  // Scripture Slide
  if (item.type === 'scripture') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* Background */}
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-600" />
        )}

        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <p className={`text-3xl md:text-4xl lg:text-5xl font-serif italic mb-8 ${textColorClass} ${shadowClass} leading-relaxed max-w-4xl`}>
            "{item.scriptureText}"
          </p>
          <p className={`text-xl md:text-2xl font-bold ${textColorClass} ${shadowClass}`}>
            {item.scriptureReference}
          </p>
          <p className={`text-lg md:text-xl opacity-80 ${textColorClass} ${shadowClass} mt-2`}>
            {item.scriptureVersion}
          </p>
        </div>
      </div>
    );
  }

  // Welcome/Logo Slide
  if (item.type === 'welcome') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-600" />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 ${textColorClass} ${shadowClass}`}>
            {item.title || 'Welcome'}
          </h1>
          {item.content && (
            <p className={`text-2xl md:text-3xl ${textColorClass} ${shadowClass} opacity-90`}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Announcement Slide
  if (item.type === 'announcement') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 to-yellow-600" />
        )}

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <h2 className={`text-5xl md:text-6xl font-bold mb-8 ${textColorClass} ${shadowClass}`}>
            {item.title}
          </h2>
          {item.content && (
            <p className={`text-2xl md:text-3xl ${textColorClass} ${shadowClass} leading-relaxed max-w-3xl whitespace-pre-wrap`}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Sermon Title Slide
  if (item.type === 'sermon') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-orange-600" />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <div className={`text-lg md:text-xl uppercase tracking-widest mb-4 ${textColorClass} ${shadowClass} opacity-80`}>
            Message
          </div>
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold ${textColorClass} ${shadowClass} leading-tight`}>
            {item.title}
          </h1>
          {item.content && (
            <p className={`text-xl md:text-2xl mt-6 ${textColorClass} ${shadowClass} opacity-90`}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Offering Slide
  if (item.type === 'offering') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-600" />
        )}

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <h2 className={`text-6xl md:text-7xl font-bold mb-6 ${textColorClass} ${shadowClass}`}>
            {item.title || 'Offering'}
          </h2>
          {item.content && (
            <p className={`text-2xl md:text-3xl ${textColorClass} ${shadowClass} max-w-3xl`}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Closing Slide
  if (item.type === 'closing') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {background ? (
          <img
            src={background.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-600" />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <h2 className={`text-6xl md:text-7xl font-bold mb-6 ${textColorClass} ${shadowClass}`}>
            {item.title || 'Thank You'}
          </h2>
          {item.content && (
            <p className={`text-2xl md:text-3xl ${textColorClass} ${shadowClass} max-w-3xl`}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Custom Slide
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {background ? (
        <img
          src={background.url}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-skyBlue to-brand-powderBlue" />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <h2 className={`text-5xl md:text-6xl font-bold mb-8 ${textColorClass} ${shadowClass}`}>
          {item.title}
        </h2>
        {item.content && (
          <p className={`text-2xl md:text-3xl ${textColorClass} ${shadowClass} max-w-3xl whitespace-pre-wrap`}>
            {item.content}
          </p>
        )}
      </div>
    </div>
  );
}
