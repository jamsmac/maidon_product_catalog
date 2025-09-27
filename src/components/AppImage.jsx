import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = "/assets/images/no_image.png";
      }}
      {...props}
    />
  );
}

export default Image;
