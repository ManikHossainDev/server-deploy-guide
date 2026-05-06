import type { GuideSection } from "@/types/guide";

export const guideSectionsPart2: GuideSection[] = [
  {
    id: "section-6",
    index: 6,
    scope: "both",
    tier: "recommended",
    titleBn: "Nginx — রিভার্স প্রক্সি",
    titleEn: "Nginx — Reverse Proxy",
    descriptionBn:
      "ইনস্টল, শেয়ার্ড proxy_params, API/ফ্রন্ট/ড্যাশবোর্ড সাইট, সাইট সক্রিয়করণ।",
    descriptionEn:
      "Install, shared proxy_params, API/front/dashboard sites, enable commands.",
    whyBn: `ব্রাউজার শুধু ৮০/৪৪৩ দেখে; আপনার Node অ্যাপ আলাদা পোর্টে চলে। Nginx রিভার্স প্রক্সি দিয়ে ডোমেইন → লোকাল পোর্ট ব্রিজ করেন, SSL এক জায়গায় টার্মিনেট করতে পারেন।
উদাহরণ: api.example.com → 127.0.0.1:4000, ওয়েব example.com → 3000 — এক সার্ভারে একাধিক অ্যাপ একই আইপিতে।`,
    whyEn: `Browsers speak HTTP/S on 80/443; your Node apps usually listen on other ports. Nginx terminates TLS and routes hostnames to the correct upstream.
Example: api.example.com → 127.0.0.1:4000 and example.com → 3000 lets multiple apps share one public IP cleanly.`,
    subsections: [
      {
        id: "6-1",
        number: "6.1",
        titleBn: "Nginx ইনস্টল",
        titleEn: "Install Nginx",
        purposeBn:
          "রিভার্স প্রক্সি ও স্ট্যাটিক ফাইল সার্ভ করার জন্য Nginx স্ট্যান্ডার্ড; সিস্টেম সার্ভিস হিসেবে সহজে রিলোড।",
        purposeEn:
          "Nginx is the usual front door for TLS and routing to your Node upstreams; installs cleanly as a systemd service.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install nginx
sudo systemctl enable --now nginx`,
          },
        ],
      },
      {
        id: "6-2",
        number: "6.2",
        titleBn: "proxy_params শেয়ার্ড ফাইল",
        titleEn: "Shared proxy_params file",
        purposeBn:
          "হেডার ও আপগ্রেড ম্যাপ এক জায়গায় রাখলে তিনটি সাইট ব্লকে কপি-পেস্ট কমে, ভুলও কমে।",
        purposeEn:
          "Centralizing proxy headers and websocket maps avoids drift across multiple server blocks.",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ফাইলটা কি বাধ্যতামূলক?",
            titleEn: "Is this file mandatory?",
            bodyBn:
              "না — সংগঠনের জন্য। একই `proxy_set_header` লাইনগুলো প্রতিটি `server { }` ব্লকের ভিতরে সরাসরি লিখলেও Nginx চলবে। শেয়ার্ড ফাইল থাকলে তিনটা সাইটে এক জায়গায় এডিট, কপি-পেস্ট ভুল কমে।",
            bodyEn:
              "No—for maintainability. Nginx works if you paste the same `proxy_set_header` lines inside each `server { }` block. A shared `proxy_params` file means one place to edit for three vhosts and fewer copy-paste mistakes.",
          },
          {
            type: "code",
            file: "/etc/nginx/proxy_params",
            lang: "nginx",
            code: `proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;`,
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "$connection_upgrade — map block আলাদা ফাইলে রাখুন",
            titleEn: "$connection_upgrade — put the map block in a separate file",
            bodyBn:
              "proxy_params-এ `Connection $connection_upgrade` ব্যবহার হয়েছে। এই variable-টি nginx-এর `http {}` context-এ `map` directive ছাড়া কাজ করে না। map block একাধিক site config-এ রাখলে nginx duplicate variable error দেয় — তাই `/etc/nginx/conf.d/upgrade-map.conf`-এ একবার রাখুন।",
            bodyEn:
              "proxy_params uses `Connection $connection_upgrade`. This variable requires a `map` directive in nginx's `http {}` context. Duplicating the map across site configs causes a nginx startup error — define it once in `/etc/nginx/conf.d/upgrade-map.conf`.",
          },
          {
            type: "code",
            file: "/etc/nginx/conf.d/upgrade-map.conf",
            lang: "nginx",
            code: `map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
      {
        id: "6-3",
        number: "6.3",
        titleBn: "Backend API সাইট",
        titleEn: "Backend API site",
        purposeBn:
          "API আলাদা হোস্টনেমে রাখলে কুকি, রেট লিমিট ও সার্ট আলাদা নিয়ন্ত্রণ করা সহজ।",
        purposeEn:
          "Splitting the API onto its own hostname isolates cookies, rate limits, and certificates from the public site.",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "map block কোথায়?",
            titleEn: "Where is the map block?",
            bodyBn:
              "WebSocket upgrade-এর জন্য `map` directive section 6.2-এ `/etc/nginx/conf.d/upgrade-map.conf`-এ রাখা হয়েছে। সেটি আগে তৈরি করে নিন।",
            bodyEn:
              "The WebSocket upgrade `map` directive lives in `/etc/nginx/conf.d/upgrade-map.conf` (section 6.2). Create that file first.",
          },
          {
            type: "code",
            file: "/etc/nginx/sites-available/api.yourdomain.com",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:4000;
  }
}`,
          },
        ],
      },
      {
        id: "6-4",
        number: "6.4",
        titleBn: "ফ্রন্টএন্ড সাইট",
        titleEn: "Frontend site",
        purposeBn:
          "ইউজার-ফেসিং অ্যাপ সাধারণত মেইন ডোমেইনে; এখানে Next/SPA আপস্ট্রিম পাস করা হয়।",
        purposeEn:
          "Public web traffic hits the main domain; this block forwards to your Next/SPA listening locally.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/sites-available/yourdomain.com",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:3000;
  }
}`,
          },
        ],
      },
      {
        id: "6-5",
        number: "6.5",
        titleBn: "ড্যাশবোর্ড সাইট",
        titleEn: "Dashboard site",
        purposeBn:
          "অ্যাডমিন/অ্যানালিটিক্স আলাদা সাবডোমেইনে রাখলে অ্যাক্সেস নিয়ন্ত্রণ ও ক্যাশ রুল আলাদা করা যায়।",
        purposeEn:
          "Admin UIs benefit from a separate subdomain for tighter access rules and caching behavior.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/sites-available/dashboard.yourdomain.com",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name dashboard.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:4100;
  }
}`,
          },
        ],
      },
      {
        id: "6-6",
        number: "6.6",
        titleBn: "সাইট সক্রিয়করণ",
        titleEn: "Enable all sites",
        purposeBn:
          "sites-available থেকে sites-enabled সিমলিংক দিয়ে সাইট চালু; nginx -t দিয়ে সিনট্যাক্স চেক করুন।",
        purposeEn:
          "Symlinks enable vhosts; always run nginx -t before reload to catch syntax errors early.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dashboard.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
      {
        id: "6-7",
        number: "6.7",
        titleBn: "SSL সার্টিফিকেট — Certbot (Required)",
        titleEn: "SSL certificate — Certbot (Required)",
        purposeBn:
          "প্রোডাকশন অ্যাপে HTTPS বাধ্যতামূলক; Certbot বিনামূল্যে Let's Encrypt সার্ট দেয় এবং Nginx কনফিগ স্বয়ংক্রিয় আপডেট করে।",
        purposeEn:
          "HTTPS is mandatory in production; Certbot issues free Let's Encrypt certs and patches your Nginx config automatically.",
        nodes: [
          {
            type: "infobox",
            variant: "warning",
            titleBn: "DNS ও Nginx আগে সেটআপ থাকতে হবে",
            titleEn: "DNS and Nginx must be configured first",
            bodyBn:
              "Certbot চালানোর আগে ডোমেইনের DNS A record আপনার সার্ভার IP-তে পয়েন্ট করা এবং Nginx-এ সেই `server_name` কনফিগ করা থাকতে হবে। DNS propagate না হলে ACME challenge fail করবে।",
            bodyEn:
              "Before running Certbot, your domain DNS A record must point to this server and Nginx must have a server block with that server_name. Certbot's HTTP challenge fails if DNS hasn't propagated yet.",
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install certbot python3-certbot-nginx

# প্রতিটি ডোমেইনের জন্য আলাদা চালান
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d dashboard.yourdomain.com`,
          },
          {
            type: "infobox",
            variant: "skip",
            titleBn: "Certbot কী করে?",
            titleEn: "What does Certbot do?",
            bodyBn:
              "Let's Encrypt ACME challenge দিয়ে ডোমেইন যাচাই করে `.pem` সার্ট ডাউনলোড করে, Nginx site config-এ `ssl_certificate` লাইন যোগ করে, এবং port 80 → 443 redirect সেটআপ করে।",
            bodyEn:
              "Certbot verifies domain ownership via ACME challenge, downloads `.pem` certs, patches your Nginx site config with ssl_certificate lines, and sets up HTTP → HTTPS redirect.",
          },
        ],
      },
      {
        id: "6-8",
        number: "6.8",
        titleBn: "HTTPS রিডাইরেক্ট ও SSL ব্লক (Certbot পরে)",
        titleEn: "HTTPS redirect & SSL block (after Certbot)",
        purposeBn:
          "Certbot চালানোর পরে Nginx site config কেমন দেখায় তা বুঝলে TLS সমস্যা নিজেই ডিবাগ করতে পারবেন।",
        purposeEn:
          "Understanding the post-Certbot Nginx config helps you verify and troubleshoot TLS setup confidently.",
        nodes: [
          {
            type: "p",
            bn: "Certbot সফলভাবে চললে site config প্রায় এরকম আপডেট হয় (Certbot নিজেই লেখে — শুধু যাচাই করুন):",
            en: "After a successful Certbot run your site config will look roughly like this (Certbot writes it—just verify it looks right):",
          },
          {
            type: "code",
            file: "/etc/nginx/sites-available/yourdomain.com (after certbot)",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name yourdomain.com www.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:3000;
  }
}`,
          },
          {
            type: "code",
            lang: "bash",
            code: `# কনফিগ টেস্ট করুন ও Nginx রিলোড
sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
      {
        id: "6-9",
        number: "6.9",
        titleBn: "সার্ট অটো-রিনিউয়াল যাচাই",
        titleEn: "Auto-renewal verification",
        purposeBn:
          "Let's Encrypt সার্ট ৯০ দিনে expire করে; systemd timer স্বয়ংক্রিয় রিনিউ করে — install-এর পরেই টাইমার active আছে কিনা যাচাই করুন।",
        purposeEn:
          "Let's Encrypt certs expire every 90 days; a systemd timer renews automatically — verify it is active right after install.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `# dry-run: সার্ট expire না হলেও রিনিউ প্রক্রিয়া সিমুলেট করে
sudo certbot renew --dry-run

# systemd timer চালু আছে কিনা দেখুন
sudo systemctl list-timers | grep certbot
sudo systemctl status certbot.timer`,
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "Timer না থাকলে — cron fallback",
            titleEn: "If timer is missing — cron fallback",
            bodyBn:
              "কিছু সিস্টেমে certbot timer স্বয়ংক্রিয় তৈরি হয় না। তখন cron যোগ করুন: `0 3 * * * certbot renew --quiet`। সার্ট expire হলে ব্রাউজারে 'Not Secure' warning আসে এবং অ্যাপ ব্লক হয়।",
            bodyEn:
              "Some setups don't auto-create the certbot timer. Add a cron fallback: `0 3 * * * certbot renew --quiet`. An expired cert shows browser security warnings and blocks your app.",
          },
        ],
      },
    ],
  },
  {
    id: "section-7",
    index: 7,
    scope: "both",
    tier: "optional",
    titleBn: "অ্যাডভান্স সিকিউরিটি — WAF ও SSL",
    titleEn: "Advanced Security — WAF & SSL",
    descriptionBn:
      "মাঝারি/বড় ট্রাফিক বা কমপ্লায়েন্সের জন্য। ছোট অ্যাপে নিচের সাবসেকশনগুলো সাধারণত ঐচ্ছিক।",
    descriptionEn:
      "For medium/large traffic or compliance. Subsections below are usually optional on small apps.",
    whyBn: `বেসিক ফায়ারওয়াল IP ফিল্টার করে; WAF/রেটলিমিট অ্যাপ লেয়ারের আক্রমণ (SQLi, স্ক্রিপ্টিং) কমায়। SSL হার্ডেনিং ব্রাউজারকে পুরনো সাইফার ব্যবহার করতে বাধা দেয়।
উদাহরণ: হঠাৎ ট্রাফিক স্পাইকে limit_req জোন দিয়ে API রুট সুরক্ষিত করতে পারেন; ছোট সাইটে শুধু Certbot+Nginx যথেষ্ট হলে WAF পরে যোগ করুন।`,
    whyEn: `Firewalls filter IPs; WAF + rate limits reduce application-layer abuse. TLS hardening removes weak ciphers and adds HSTS so browsers enforce HTTPS.
Example: rate-limit /api on Nginx when you see scraping spikes; on a tiny site, start with Certbot + sane headers and add ModSecurity later.`,
    subsections: [
      {
        id: "7-1",
        optional: true,
        number: "7.1",
        titleBn: "ModSecurity WAF",
        titleEn: "ModSecurity WAF",
        purposeBn:
          "অ্যাপ কোডের বাইরে কমন ওয়েব আক্রমণ ফিল্টার করতে WAF; ট্রাফিক বেশি হলে বেশি দরকার।",
        purposeEn:
          "A WAF blocks common web exploits before they hit your app—more valuable as traffic and risk grow.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install libnginx-mod-http-modsecurity
sudo mkdir -p /etc/nginx/modsec
sudo wget -qO /etc/nginx/modsec/modsecurity.conf https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended`,
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "OWASP CRS ছাড়া ModSecurity প্রায় কিছুই block করে না",
            titleEn: "ModSecurity does very little without OWASP CRS",
            bodyBn:
              "ModSecurity শুধু ইঞ্জিন — আক্রমণ block করতে OWASP Core Rule Set (CRS) rules লাগে। নিচে CRS install ও nginx.conf-এ include করা দেখানো হয়েছে।",
            bodyEn:
              "ModSecurity is just the engine — blocking attacks requires OWASP Core Rule Set (CRS) rules. The steps below add CRS and wire it into nginx.conf.",
          },
          {
            type: "code",
            file: "OWASP CRS ইনস্টল",
            lang: "bash",
            code: `sudo apt -y install git
sudo git clone https://github.com/coreruleset/coreruleset /etc/nginx/modsec/owasp-crs
sudo cp /etc/nginx/modsec/owasp-crs/crs-setup.conf.example /etc/nginx/modsec/owasp-crs/crs-setup.conf`,
          },
          {
            type: "code",
            file: "/etc/nginx/modsec/main.conf",
            lang: "nginx",
            code: `Include /etc/nginx/modsec/modsecurity.conf
Include /etc/nginx/modsec/owasp-crs/crs-setup.conf
Include /etc/nginx/modsec/owasp-crs/rules/*.conf
SecRuleEngine On`,
          },
          {
            type: "code",
            file: "/etc/nginx/nginx.conf — http { } block এর ভেতরে যোগ করুন",
            lang: "nginx",
            code: `modsecurity on;
modsecurity_rules_file /etc/nginx/modsec/main.conf;`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
      {
        id: "7-2",
        optional: true,
        number: "7.2",
        titleBn: "DDoS সুরক্ষা (Nginx)",
        titleEn: "DDoS protection (Nginx)",
        purposeBn:
          "সস্তা বট ট্রাফিক বা রিপিটেড রিকোয়েস্ট এজে কেটে অ্যাপ সার্ভার সুরক্ষিত রাখে।",
        purposeEn:
          "Basic rate/connection limits at the edge absorb noisy bots so your Node process stays responsive.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/conf.d/ddos-protection.conf",
            lang: "nginx",
            code: `limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
  limit_req zone=perip burst=20 nodelay;
  limit_conn addr 20;
}`,
          },
        ],
      },
      {
        id: "7-3",
        optional: true,
        number: "7.3",
        titleBn: "SSL হার্ডেনিং",
        titleEn: "SSL hardening",
        purposeBn:
          "Let's Encrypt সার্ট পেলেও দুর্বল সাইফার বা HSTS ছাড়া ব্রাউজার স্কোর ও সিকিউরিটি কমে।",
        purposeEn:
          "After issuance, tighten protocols/ciphers and add HSTS so browsers enforce modern TLS behavior.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`,
          },
          {
            type: "code",
            file: "/etc/nginx/snippets/ssl-hardening.conf",
            lang: "nginx",
            code: `ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;`,
          },
          {
            type: "p",
            bn: "সার্ট ইস্যুর পরে SSL ল্যাবস বা মজিলা অবজারভেটরি দিয়ে গ্রেড পরীক্ষা করুন।",
            en: "After issuance, verify grade with SSL Labs or Mozilla Observatory.",
          },
        ],
      },
    ],
  },
  {
    id: "section-8",
    index: 8,
    scope: "both",
    tier: "optional",
    titleBn: "Cloudflare Tunnel",
    titleEn: "Cloudflare Tunnel",
    descriptionBn:
      "Dashboard থেকে connector ইনস্টল করে hostname → localhost:PORT ম্যাপ করুন। Nginx ও SSL সার্ট ছাড়াই সাইট চলে।",
    descriptionEn:
      "Install the connector from the dashboard and map hostnames to localhost ports. No Nginx or SSL certificate needed.",
    whyBn: `Cloudflare Tunnel মানে আপনার সার্ভার থেকে Cloudflare-এর দিকে একটা আউটবাউন্ড সংযোগ — ইনবাউন্ড পোর্ট (80/443) খুলতে হয় না। Cloudflare নিজেই SSL টার্মিনেট করে এবং hostname অনুযায়ী ট্রাফিক রুট করে।
উদাহরণ: api.yourdomain.com → localhost:4000, yourdomain.com → localhost:3000 — Nginx ছাড়াই, সার্টিফিকেট ছাড়াই।`,
    whyEn: `Cloudflare Tunnel creates an outbound-only connection from your server to Cloudflare's edge — no inbound ports needed. Cloudflare terminates SSL and routes traffic by hostname.
Example: api.yourdomain.com → localhost:4000, yourdomain.com → localhost:3000 — no Nginx, no certificate management.`,
    subsections: [
      {
        id: "8-0",
        number: "8.0",
        titleBn: "Nginx বনাম Cloudflare Tunnel — কোনটা বেছে নেবেন?",
        titleEn: "Nginx vs Cloudflare Tunnel — which to choose?",
        purposeBn:
          "দুটি পথ একেবারে আলাদা আর্কিটেকচার — একটি বেছে নিন, দুটো একসাথে সাধারণত দরকার নেই।",
        purposeEn:
          "The two approaches have different architectures — pick one; running both is usually unnecessary complexity.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["বিষয়", "Nginx + Certbot", "Cloudflare Tunnel"],
              en: ["Aspect", "Nginx + Certbot", "Cloudflare Tunnel"],
            },
            rows: [
              {
                bn: ["SSL সার্টিফিকেট", "নিজে manage (Certbot)", "Cloudflare handle করে — লাগে না"],
                en: ["SSL certificate", "Self-managed (Certbot)", "Cloudflare handles it — not needed"],
              },
              {
                bn: ["Port 80/443", "সার্ভারে খুলতে হবে", "বন্ধ রাখা যায় — outbound only"],
                en: ["Port 80/443", "Must open on server", "Can stay closed — outbound only"],
              },
              {
                bn: ["Nginx", "লাগে", "লাগে না"],
                en: ["Nginx", "Required", "Not needed"],
              },
              {
                bn: ["সেটআপ জটিলতা", "বেশি (Nginx config, certbot)", "কম (dashboard click করুন)"],
                en: ["Setup complexity", "More (Nginx config, certbot)", "Less (dashboard clicks)"],
              },
              {
                bn: ["Cloudflare dependency", "নেই (সরাসরি VPS IP)","Cloudflare ছাড়া site চলবে না"],
                en: ["Cloudflare dependency", "None (direct VPS IP)", "Site won't work without Cloudflare"],
              },
              {
                bn: ["কখন বেছে নেবেন", "Cloudflare ছাড়া চালাতে চাইলে বা custom Nginx config দরকার হলে", "সহজ সেটআপ, SSL ঝামেলা এড়াতে, বা inbound port বন্ধ রাখতে চাইলে"],
                en: ["When to choose", "If you want no Cloudflare dependency or need custom Nginx rules", "Simpler setup, avoid SSL hassle, or keep inbound ports closed"],
              },
            ],
          },
          {
            type: "infobox",
            variant: "skip",
            titleBn: "দুটো একসাথে লাগবে কি?",
            titleEn: "Do I need both?",
            bodyBn:
              "সাধারণত না। Cloudflare Tunnel ব্যবহার করলে Nginx ও Certbot দরকার নেই — Tunnel নিজেই hostname → localhost:PORT routing করে। শুধু তখনই দুটো লাগে যদি একই সার্ভারে কিছু সার্ভিস Tunnel-এ আর কিছু সরাসরি IP-তে চালাতে চান।",
            bodyEn:
              "Usually no. With Cloudflare Tunnel you do not need Nginx or Certbot — the tunnel handles hostname routing to localhost ports. You only need both if some services run through the tunnel and others need direct IP access on the same server.",
          },
        ],
      },
      {
        id: "8-1",
        number: "8.1",
        titleBn: "ধাপ ১ — Cloudflare-এ Domain যোগ করুন ও Nameserver পরিবর্তন",
        titleEn: "Step 1 — Add domain to Cloudflare and update nameservers",
        purposeBn:
          "Tunnel ব্যবহারের আগে domain টি Cloudflare-এর নিয়ন্ত্রণে আনতে হবে — nameserver পরিবর্তন করেই এটা হয়।",
        purposeEn:
          "Before using a tunnel your domain must be managed by Cloudflare — changing nameservers at your registrar does this.",
        nodes: [
          {
            type: "ol",
            items: [
              {
                bn: "cloudflare.com-এ লগইন করুন। Home page-এ বা বাম sidebar-এ **Websites** (বা Domains/Overview) থেকে **Add a site** বা **Add a domain** বাটনে ক্লিক করুন।",
                en: "Log in to cloudflare.com. From the home page or left sidebar under Websites (Domains/Overview), click **Add a site** or **Add a domain**.",
              },
              {
                bn: "**Connect your domain** অপশন বেছে নিন। Domain name টাইপ করুন (যেমন `yourdomain.com`) → **Continue**।",
                en: "Choose **Connect your domain**. Type your domain name (e.g. `yourdomain.com`) → **Continue**.",
              },
              {
                bn: "Plan বেছে নিন — **Free** plan-এ সব দরকারি feature আছে → **Continue**।",
                en: "Select a plan — the **Free** plan has everything you need for most apps → **Continue**.",
              },
              {
                bn: "Cloudflare আপনার domain-এর বিদ্যমান DNS record scan করবে। **Quick scan** রেজাল্ট review করুন — সব ঠিক থাকলে **Continue**।",
                en: "Cloudflare scans your existing DNS records. Review the **Quick scan** results — if they look correct click **Continue**.",
              },
              {
                bn: "Cloudflare দুটো nameserver দেবে (যেমন `alice.ns.cloudflare.com` ও `bob.ns.cloudflare.com`)। এগুলো copy করুন।",
                en: "Cloudflare gives you two nameservers (e.g. `alice.ns.cloudflare.com` and `bob.ns.cloudflare.com`). Copy both.",
              },
              {
                bn: "Domain কেনার জায়গায় (Namecheap, GoDaddy, Dynadot যেটাই হোক) লগইন করুন → Domain management → **Custom nameservers** বা **Nameservers** সেকশনে যান → Cloudflare-এর দেওয়া দুটো nameserver বসান → Save।",
                en: "Log in to your registrar (Namecheap, GoDaddy, Dynadot, etc.) → Domain management → find the **Custom nameservers** or **Nameservers** section → paste both Cloudflare nameservers → Save.",
              },
              {
                bn: "Cloudflare-এ ফিরে আসুন এবং **Done, check nameservers** বাটনে ক্লিক করুন। Propagation সাধারণত ৫ মিনিট থেকে ২৪ ঘণ্টা লাগে। Active হলে ইমেইল পাবেন।",
                en: "Return to Cloudflare and click **Done, check nameservers**. Propagation typically takes 5 minutes to 24 hours — you will receive an email when the domain goes active.",
              },
            ],
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "Nameserver propagation চলাকালে site ভাঙতে পারে",
            titleEn: "Site may be briefly unreachable during propagation",
            bodyBn:
              "Nameserver পরিবর্তনের পর পুরানো ও নতুন DNS একসাথে active থাকে — এই সময়ে কিছু ব্যবহারকারীর কাছে site ভিন্ন দেখাতে পারে বা না খুলতে পারে। Propagation শেষ হওয়ার পর ঠিক হবে।",
            bodyEn:
              "During nameserver propagation old and new DNS coexist — some users may see inconsistent results or brief outages. This resolves automatically once propagation completes.",
          },
        ],
      },
      {
        id: "8-2",
        number: "8.2",
        titleBn: "ধাপ ২ — Zero Trust Tunnel তৈরি ও Connector ইনস্টল",
        titleEn: "Step 2 — Create Zero Trust tunnel and install connector",
        purposeBn:
          "Tunnel তৈরি করলে Cloudflare একটি unique token সহ install command দেয় — সেটি সার্ভারে চালালেই connector চালু হয়।",
        purposeEn:
          "Creating a tunnel gives you a unique install command with a token — running it on the server starts the connector that Cloudflare controls.",
        nodes: [
          {
            type: "ol",
            items: [
              {
                bn: "Cloudflare Dashboard-এর বাম sidebar থেকে **Zero Trust** → **Networks** → **Tunnels** → **Create a tunnel** ক্লিক করুন।",
                en: "From the Cloudflare Dashboard left sidebar: **Zero Trust** → **Networks** → **Tunnels** → click **Create a tunnel**.",
              },
              {
                bn: "Connector type: **Cloudflared** বেছে নিন → **Next**। Tunnel-এর একটি নাম দিন (যেমন `production`) → **Save tunnel**।",
                en: "Select connector type **Cloudflared** → **Next**. Give the tunnel a name (e.g. `production`) → **Save tunnel**.",
              },
              {
                bn: "**Install and run a connector** ধাপে OS হিসেবে **Debian** বা **Linux** বেছে নিন। Cloudflare একটি command দেবে যার মধ্যে unique token আছে।",
                en: "On the **Install and run a connector** step, select **Debian** or **Linux** as the OS. Cloudflare shows a command that contains a unique token.",
              },
              {
                bn: "সার্ভারে SSH করুন এবং Cloudflare-এর দেওয়া সেই command টি হুবহু চালান। Command দেখতে নিচের মতো হবে (token আপনার নিজের হবে)।",
                en: "SSH into your server and run the exact command Cloudflare gave you. It will look like the example below (your token will be different).",
              },
              {
                bn: "Command চালানোর পরে Cloudflare dashboard-এ connector **Connected** দেখাবে → **Next** চাপুন।",
                en: "After running the command the connector shows **Connected** in the dashboard → click **Next**.",
              },
            ],
          },
          {
            type: "code",
            file: "Cloudflare-এর দেওয়া command (উদাহরণ — token আপনার নিজের হবে)",
            lang: "bash",
            code: `curl -L --output cloudflared.deb \\
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb \\
  && sudo dpkg -i cloudflared.deb \\
  && sudo cloudflared service install eyJhIjoiYWJjZGVm...YOUR_TOKEN_HERE`,
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "Token কারো সাথে শেয়ার করবেন না",
            titleEn: "Never share the token",
            bodyBn:
              "Cloudflare-এর দেওয়া command-এ যে token আছে সেটি আপনার tunnel-এর secret — এটি GitHub, chat বা screenshot-এ শেয়ার করলে যে কেউ আপনার tunnel-এ প্রবেশ করতে পারবে।",
            bodyEn:
              "The token inside the install command is your tunnel secret — never paste it into GitHub, chat, or screenshots. Anyone with the token can connect to your tunnel.",
          },
        ],
      },
      {
        id: "8-3",
        number: "8.3",
        titleBn: "ধাপ ৩ — Public Hostname যোগ করুন",
        titleEn: "Step 3 — Add public hostnames",
        purposeBn:
          "Hostname mapping-এ domain → localhost:PORT বলে দিলে Cloudflare সেই domain-এ আসা ট্রাফিক সার্ভারের সঠিক port-এ পাঠায়।",
        purposeEn:
          "Hostname mappings tell Cloudflare which local port to forward each domain to — one entry per service.",
        nodes: [
          {
            type: "p",
            bn: "Connector connected হওয়ার পর **Public Hostname** ট্যাবে প্রতিটি সার্ভিসের জন্য একটি করে entry যোগ করুন:",
            en: "After the connector is connected, go to the **Public Hostname** tab and add one entry per service:",
          },
          {
            type: "table",
            headers: {
              bn: ["Subdomain", "Domain", "Type", "URL", "কোন সার্ভিস"],
              en: ["Subdomain", "Domain", "Type", "URL", "Service"],
            },
            rows: [
              {
                bn: ["(খালি)", "yourdomain.com", "HTTP", "localhost:3000", "Frontend (Next.js/React)"],
                en: ["(blank)", "yourdomain.com", "HTTP", "localhost:3000", "Frontend (Next.js/React)"],
              },
              {
                bn: ["www", "yourdomain.com", "HTTP", "localhost:3000", "Frontend (www redirect)"],
                en: ["www", "yourdomain.com", "HTTP", "localhost:3000", "Frontend (www redirect)"],
              },
              {
                bn: ["api", "yourdomain.com", "HTTP", "localhost:4000", "Backend API"],
                en: ["api", "yourdomain.com", "HTTP", "localhost:4000", "Backend API"],
              },
              {
                bn: ["dashboard", "yourdomain.com", "HTTP", "localhost:4100", "Admin dashboard"],
                en: ["dashboard", "yourdomain.com", "HTTP", "localhost:4100", "Admin dashboard"],
              },
            ],
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "Type সবসময় HTTP রাখুন",
            titleEn: "Always set Type to HTTP",
            bodyBn:
              "URL হলো `localhost:PORT` — সার্ভারের ভেতরে HTTPS নেই। Type যদি HTTPS দেন তাহলে Cloudflare সার্ভারের সাথে TLS handshake করতে গিয়ে fail করবে এবং ব্যবহারকারী 502 error পাবে।",
            bodyEn:
              "The URL is `localhost:PORT` — there is no HTTPS inside the server. Setting Type to HTTPS causes Cloudflare to attempt a TLS handshake with localhost which fails, giving users a 502 error.",
          },
          {
            type: "infobox",
            variant: "skip",
            titleBn: "সেটআপ শেষ — Nginx ও Certbot লাগবে না",
            titleEn: "Done — Nginx and Certbot are not needed",
            bodyBn:
              "এখন yourdomain.com HTTPS-এ চলবে, api.yourdomain.com-ও। Nginx ইনস্টল করতে হবে না, SSL সার্টিফিকেটও লাগবে না — সব Cloudflare handle করছে। UFW-এ 80 ও 443 বন্ধ রাখতে পারেন।",
            bodyEn:
              "yourdomain.com and api.yourdomain.com now serve HTTPS automatically. No Nginx to install, no SSL certs to manage — Cloudflare handles everything. You can keep ports 80 and 443 closed in UFW.",
          },
        ],
      },
      {
        id: "8-4",
        optional: true,
        number: "8.4",
        titleBn: "UFW আপডেট — 80/443 বন্ধ করুন",
        titleEn: "UFW update — close ports 80 and 443",
        purposeBn:
          "Tunnel ব্যবহারে ইনবাউন্ড HTTP/HTTPS-এর দরকার নেই — বন্ধ করলে attack surface আরও কমে।",
        purposeEn:
          "With a tunnel, inbound HTTP/HTTPS are no longer needed — closing them reduces the attack surface further.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw status verbose
# এখন শুধু 22 (SSH) খোলা থাকবে`,
          },
        ],
      },
      {
        id: "8-5",
        optional: true,
        number: "8.5",
        titleBn: "Cloudflare Dashboard সেটিংস",
        titleEn: "Cloudflare dashboard settings",
        purposeBn:
          "ভুল SSL মোড বা aggressive caching SPA/Next.js ভেঙে দেয়; নিচের টেবিল নিরাপদ default দেখায়।",
        purposeEn:
          "Wrong SSL mode or aggressive caching breaks SPAs; this table shows safe defaults for tunneled origins.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["সেটিং", "সুপারিশকৃত মান", "কেন"],
              en: ["Setting", "Recommended value", "Why"],
            },
            rows: [
              {
                bn: ["SSL মোড", "Flexible", "Origin localhost HTTP — Full দিলে 526 error"],
                en: ["SSL mode", "Flexible", "Origin is localhost HTTP — Full causes 526 error"],
              },
              {
                bn: ["Always HTTPS", "চালু", "HTTP → HTTPS redirect Cloudflare করবে"],
                en: ["Always HTTPS", "On", "Cloudflare enforces HTTPS redirect"],
              },
              {
                bn: ["Rocket Loader", "বন্ধ", "SPA/Next.js-এ JS execution ভেঙে দিতে পারে"],
                en: ["Rocket Loader", "Off", "Can break JS execution in SPA/Next.js"],
              },
              {
                bn: ["Bot Fight Mode", "চালু (প্রয়োজনে)", "Basic bot protection বিনামূল্যে"],
                en: ["Bot Fight Mode", "On (as needed)", "Free basic bot protection"],
              },
              {
                bn: ["Cache Rules", "HTML no-cache, static long-cache", "Dynamic page cache করলে stale data দেখাবে"],
                en: ["Cache rules", "Bypass HTML, long-cache static", "Caching HTML serves stale data"],
              },
              {
                bn: ["WAF", "Managed rulesets", "Cloudflare-এর built-in WAF চালু রাখুন"],
                en: ["WAF", "Managed rulesets", "Keep Cloudflare's built-in WAF active"],
              },
            ],
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "SSL মোড সতর্কতা",
            titleEn: "SSL mode warning",
            bodyBn:
              "Tunnel ব্যবহারে origin localhost HTTP — তাই SSL মোড Flexible রাখুন। Full (strict) দিলে Cloudflare origin-এ valid SSL cert খুঁজবে কিন্তু পাবে না — 526 error আসবে।",
            bodyEn:
              "With a tunnel the origin is localhost HTTP — keep SSL mode Flexible. Full (strict) makes Cloudflare look for a valid SSL cert on the origin which doesn't exist, causing a 526 error.",
          },
        ],
      },
    ],
  },
  {
    id: "section-9",
    index: 9,
    scope: "both",
    tier: "optional",
    titleBn: "Prometheus + Grafana মনিটরিং",
    titleEn: "Prometheus + Grafana Monitoring",
    descriptionBn:
      "প্রোডাকশন পর্যবেক্ষণ — ছোট প্রোজেক্টে ঐচ্ছিক; মাঝারি/বড় দলের জন্য সুপারিশ।",
    descriptionEn:
      "Production observability — optional for tiny projects; recommended for medium/large teams.",
    whyBn: `মেট্রিক্স দিয়ে বুঝবেন CPU/RAM/ডিস্ক কখন শেষ হচ্ছে, কোন সার্ভিস ডাউন। Grafana দিয়ে চার্ট; Uptime Kuma দিয়ে বাইরে থেকে HTTP চেক।
উদাহরণ: Node মেমরি লিক হলে Grafana গ্রাফে ধীরে ধীরে RAM বাড়া দেখা যায়; আপটাইম টুল আলার্ট দেয় "৫০২ শুরু হয়েছে"।`,
    whyEn: `Metrics answer "why is it slow?" before users complain—CPU saturation, disk full, DB latency. Dashboards make trends obvious; uptime checks alert when HTTP fails.
Example: a memory leak shows as a slow RAM climb in Grafana; an external ping catches 502s when Nginx can't reach upstream.`,
    subsections: [
      {
        id: "9-1",
        optional: true,
        number: "9.1",
        titleBn: "Prometheus ইনস্টল",
        titleEn: "Install Prometheus",
        purposeBn:
          "মেট্রিক্স টাইম সিরিজে জমা করে অ্যানোমালি ধরতে; node exporter সহ সার্ভার হেলথ দেখা যায়।",
        purposeEn:
          "Prometheus scrapes metrics so you can alert on saturation trends before users notice slowdowns.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `cd /tmp
VER=$(curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest | grep tag_name | cut -d '"' -f4)
VERFILE=$(echo "$VER" | sed 's/^v//')
wget "https://github.com/prometheus/prometheus/releases/download/\${VER}/prometheus-\${VERFILE}.linux-amd64.tar.gz"
tar xvf prometheus-*.linux-amd64.tar.gz
sudo mv prometheus-*.linux-amd64 /opt/prometheus`,
          },
          {
            type: "code",
            file: "/opt/prometheus/prometheus.yml",
            lang: "yaml",
            code: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: node
    static_configs:
      - targets: ["127.0.0.1:9100"]`,
          },
        ],
      },
      {
        id: "9-2",
        optional: true,
        number: "9.2",
        titleBn: "Grafana ইনস্টল",
        titleEn: "Install Grafana",
        purposeBn:
          "শুধু সংখ্যা নয় চার্ট দরকার হলে Grafana; টিমকে একই ড্যাশবোর্ড শেয়ার করা সহজ।",
        purposeEn:
          "Grafana turns raw metrics into dashboards your team can share during incidents and capacity planning.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `# GPG কী — apt-key deprecated (Ubuntu 22.04+), keyring পদ্ধতি ব্যবহার করুন
sudo mkdir -p /etc/apt/keyrings
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update && sudo apt -y install grafana
sudo systemctl enable --now grafana-server`,
          },
        ],
      },
      {
        id: "9-3",
        optional: true,
        number: "9.3",
        titleBn: "ড্যাশবোর্ড আইডি",
        titleEn: "Dashboard IDs",
        purposeBn:
          "প্রস্তুত ড্যাশবোর্ড আইডি দিয়ে দ্রুত Node/DB/Docker ভিউ আমদানি — নিজে সব প্যানেল বানানোর সময় বাঁচে।",
        purposeEn:
          "Community dashboard IDs bootstrap useful panels instead of building every graph from scratch.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["আইডি", "বিবরণ"],
              en: ["ID", "Description"],
            },
            rows: [
              { bn: ["1860", "Node Exporter Full"], en: ["1860", "Node Exporter Full"] },
              { bn: ["3662", "Prometheus 2.0"], en: ["3662", "Prometheus 2.0"] },
              { bn: ["7362", "MongoDB"], en: ["7362", "MongoDB"] },
              { bn: ["9628", "PostgreSQL"], en: ["9628", "PostgreSQL"] },
              { bn: ["11835", "Redis"], en: ["11835", "Redis"] },
              { bn: ["12708", "Docker"], en: ["12708", "Docker"] },
            ],
          },
        ],
      },
      {
        id: "9-4",
        optional: true,
        number: "9.4",
        titleBn: "Uptime Kuma",
        titleEn: "Uptime Kuma",
        purposeBn:
          "বাইরে থেকে HTTP পিং করে ডাউনটাইম নোটিফিকেশন; মেট্রিক্সের পাশাপাশি ইউজার-ফেসিং চেক।",
        purposeEn:
          "Synthetic checks complement metrics by proving the site is reachable the way a customer sees it.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1`,
          },
        ],
      },
    ],
  },
  {
    id: "section-10",
    index: 10,
    scope: "both",
    tier: "recommended",
    titleBn: "স্টেজিং ও Git ওয়ার্কফ্লো",
    titleEn: "Staging Environment & Git Workflow",
    descriptionBn:
      "ব্রাঞ্চিং ও ডেপ্লয় ফ্লো সবার জন্য; পৃথক স্টেজিং সার্ভার ঐচ্ছিক (ছোট টিমে প্রায়ই মেইন+ট্যাগই যথেষ্ট)।",
    descriptionEn:
      "Branching and deploy flow for everyone; separate staging servers are optional (small teams often ship from main + tags).",
    whyBn: `ব্রাঞ্চ মডেল দিয়ে কোড কোথায় মার্জ হবে স্পষ্ট হয় — প্রোড শুধু main থেকে। স্টেজিং সার্ভার দিয়ে ক্লায়েন্ট UAT বা ইন্টিগ্রেশন টেস্ট আলাদা রাখা যায়।
উদাহরণ: feature/login → PR → staging এ মার্জ → QA OK হলে main → প্রোড ডেপ্লয়; হটফিক্স ব্রাঞ্চ দিয়ে জরুরি প্যাচ আলাদা ট্র্যাক করুন।`,
    whyEn: `Branching defines where code is allowed to land—production should only move from a protected branch. Staging mirrors prod data/config at lower risk.
Example: feature/login → PR → merge to staging → QA sign-off → merge to main → deploy; hotfix/* for emergency patches with a shorter path.`,
    subsections: [
      {
        id: "10-1",
        number: "10.1",
        titleBn: "Git ব্রাঞ্চিং",
        titleEn: "Git branching",
        purposeBn:
          "কোন ব্রাঞ্চে কী ধরনের কোড থাকবে স্পষ্ট করলে রিলিজ ও হটফিক্স ট্র্যাক করা সহজ।",
        purposeEn:
          "Branch rules clarify where integrations happen versus what is allowed to reach production.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["ব্রাঞ্চ", "উদ্দেশ্য"],
              en: ["Branch", "Purpose"],
            },
            rows: [
              { bn: ["main", "প্রোডাকশন"], en: ["main", "Production"] },
              { bn: ["staging", "প্রি-প্রোড ইন্টিগ্রেশন"], en: ["staging", "Pre-prod integration"] },
              { bn: ["develop", "ডেভ ইন্টিগ্রেশন"], en: ["develop", "Dev integration"] },
              { bn: ["feature/*", "ফিচার কাজ"], en: ["feature/*", "Feature work"] },
              { bn: ["hotfix/*", "জরুরি প্যাচ"], en: ["hotfix/*", "Emergency patch"] },
            ],
          },
        ],
      },
      {
        id: "10-2",
        optional: true,
        number: "10.2",
        titleBn: "স্টেজিং (ম্যানুয়াল)",
        titleEn: "Staging (manual)",
        purposeBn:
          "প্রোডের আগে আলাদা .env ও পোর্টে চালিয়ে রিগ্রেশন ধরা; PM2 এ আলাদা env দিয়ে চালানো যায়।",
        purposeEn:
          "Manual staging mirrors prod config on separate ports/env files before you promote to main.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo mkdir -p /var/www/staging && sudo chown deploy:deploy /var/www/staging
cd /var/www/staging
git clone -b staging git@github.com:org/backend.git
cp /var/www/staging/backend/.env.example /var/www/staging/backend/.env.staging
# edit DATABASE_URL, secrets for staging
cd /var/www/staging/backend && npm ci && npm run build
pm2 start ecosystem.config.js --env staging`,
          },
        ],
      },
      {
        id: "10-3",
        optional: true,
        number: "10.3",
        titleBn: "স্টেজিং (ডকার)",
        titleEn: "Staging (Docker)",
        purposeBn:
          "compose override দিয়ে স্টেজিং ইমেজ ট্যাগ ও পোর্ট আলাদা রেখে একই রিপো থেকে টেস্ট।",
        purposeEn:
          "Compose overrides swap image tags/ports so staging runs beside prod definitions without fork drift.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: "docker-compose.staging.yml",
            lang: "yaml",
            code: `services:
  api:
    image: ghcr.io/org/api:staging
    env_file: .env.staging
    ports: ["4001:4000"]`,
          },
        ],
      },
      {
        id: "10-4",
        number: "10.4",
        titleBn: "ডেপ্লয় ফ্লো",
        titleEn: "Deployment flow",
        purposeBn:
          "ফিচার থেকে প্রোড পর্যন্ত ধাপ লিখে রাখলে টিম একই রিদমে রিলিজ করে; UAT বাদ দিলে ঝুঁকি বাড়ে।",
        purposeEn:
          `An ordered flow keeps QA/UAT explicit so releases are predictable instead of "merge and hope".`,
        nodes: [
          {
            type: "ol",
            items: [
              {
                bn: "ফিচার ব্রাঞ্চে কাজ ও PR",
                en: "Work on feature branch & open PR",
              },
              {
                bn: "স্টেজিংয়ে মার্জ ও স্বয়ংক্রিয়/ম্যানুয়াল টেস্ট",
                en: "Merge to staging & automated/manual tests",
              },
              {
                bn: "স্টেকহোল্ডার UAT",
                en: "Stakeholder UAT",
              },
              {
                bn: "মেইনে মার্জ (প্রোড)",
                en: "Merge to main (prod)",
              },
              {
                bn: "বিল্ড আর্টিফ্যাক্ট/ইমেজ তৈরি",
                en: "Build artifact/image",
              },
              {
                bn: "ব্যাকআপ নিশ্চিত",
                en: "Verify backups",
              },
              {
                bn: "রোলিং ডেপ্লয়",
                en: "Rolling deploy",
              },
              {
                bn: "পোস্ট-ডেপ্লয় স্বাস্থ্য পরীক্ষা",
                en: "Post-deploy health checks",
              },
            ],
          },
        ],
      },
    ],
  },
];
