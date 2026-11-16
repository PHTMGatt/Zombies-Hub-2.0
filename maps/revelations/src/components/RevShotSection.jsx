import React from 'react';

// A tab section of reference screenshots: a heading (the link target) and one figure per image, in a plain grid.
// groups: [{ id, label, images: [{ src, alt, caption, width, height }] }]
function RevShotSection({ id, title, intro, groups }) {
  return (
    <section className="rev-shots" id={id} aria-labelledby={`${id}-title`}>
      <h2 className="rev-shots__title" id={`${id}-title`}>{title}</h2>
      {intro && <p className="rev-shots__intro">{intro}</p>}
      {groups.map((group) => (
        <div className="rev-shots__group" key={group.id}>
          {group.label && <h3 className="rev-shots__label">{group.label}</h3>}
          <div className="rev-shots__grid">
            {group.images.map((img) => (
              <figure className="rev-shots__fig" key={img.src}>
                <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
                <figcaption>{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default RevShotSection;
