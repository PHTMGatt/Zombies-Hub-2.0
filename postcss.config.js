const featureScopes = [
  // Legacy Hub presentation CSS is contained so generic classes such as
  // .bg-blur cannot affect a dedicated map module.
  ['apps/hub/src/styles/compStyles/', '.hub-content'],
  ['apps/hub/src/styles/pageStyles/', '.hub-content'],
  ['apps/hub/src/styles/SideEE/', '.hub-content'],
  ['apps/hub/src/styles/Global.css', '.hub-content'],

  // Dedicated map applications keep their original CSS, automatically scoped
  // to their feature root at build time.
  ['maps/mob-of-the-dead/', '.mob-module'],
  ['maps/der-eisendrache/', '.de-module'],
  ['maps/zetsubou-no-shima/', '.zets-module'],
  ['maps/gorod-krovi/', '.gorod-module'],
  ['maps/revelations/', '.revelations-module'],
];

function scopeSelector(selector, scope) {
  const trimmed = selector.trim();

  if (!trimmed || trimmed.includes(scope)) return trimmed;

  if (trimmed === ':root' || trimmed === 'html' || trimmed === 'body' || trimmed === '#root') {
    return scope;
  }

  if (/^(body|html)(?=[:.#\[])/.test(trimmed)) {
    return trimmed.replace(/^(body|html)/, scope);
  }

  if (trimmed.startsWith('#root')) {
    return trimmed.replace(/^#root/, scope);
  }

  return `${scope} ${trimmed}`;
}

const zombiesFeatureScope = {
  postcssPlugin: 'zombies-feature-scope',
  Rule(rule) {
    const file = rule.source?.input?.file?.replaceAll('\\', '/') || '';
    const match = featureScopes.find(([fragment]) => file.includes(fragment));
    if (!match) return;

    let parent = rule.parent;
    while (parent) {
      if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
      parent = parent.parent;
    }

    const scope = match[1];
    rule.selectors = rule.selectors.map(selector => scopeSelector(selector, scope));
  },
};

export default {
  plugins: [zombiesFeatureScope],
};
