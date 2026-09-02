const mapScopes = [
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

  if (trimmed.startsWith('body::') || trimmed.startsWith('body:')) {
    return trimmed.replace(/^body/, scope);
  }

  if (trimmed.startsWith('html::') || trimmed.startsWith('html:')) {
    return trimmed.replace(/^html/, scope);
  }

  if (trimmed.startsWith('#root')) {
    return trimmed.replace(/^#root/, scope);
  }

  return `${scope} ${trimmed}`;
}

const zombiesMapScope = {
  postcssPlugin: 'zombies-map-scope',
  Rule(rule) {
    const file = rule.source?.input?.file?.replaceAll('\\', '/') || '';
    const match = mapScopes.find(([fragment]) => file.includes(fragment));
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
  plugins: [zombiesMapScope],
};
