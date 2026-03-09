const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'blog', 'posts');
const outputFile = path.join(__dirname, '..', 'blog', 'posts.json');

const META_PATTERNS = {
  title: /<title>([^<]+)<\/title>/i,
  description: /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  date: /<meta\s+name=["']post-date["']\s+content=["']([^"']+)["']/i,
  image: /<meta\s+name=["']post-image["']\s+content=["']([^"']+)["']/i,
  category: /<meta\s+name=["']post-category["']\s+content=["']([^"']+)["']/i,
};

function extractMeta(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : '';
}

function main() {
  if (!fs.existsSync(postsDir)) {
    fs.writeFileSync(outputFile, '[]', 'utf8');
    console.log('No posts directory found. Wrote empty posts.json');
    return;
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

  const posts = files.map(file => {
    const html = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const slug = path.basename(file, '.html');

    return {
      title: extractMeta(html, META_PATTERNS.title),
      description: extractMeta(html, META_PATTERNS.description),
      date: extractMeta(html, META_PATTERNS.date),
      slug,
      image: extractMeta(html, META_PATTERNS.image) || `images/default.jpg`,
      category: extractMeta(html, META_PATTERNS.category),
      url: `posts/${slug}.html`,
    };
  });

  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Generated posts.json with ${posts.length} post(s)`);
}

main();
