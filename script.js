// Masum Mz Portfolio - Interactive Video Editor Features & Audio Synthesizer

document.addEventListener('DOMContentLoaded', () => {
  // 0. Logo click -> full page refresh (start from top)
  const logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      window.location.href = window.location.pathname;
    });
  }

  // 1. Mobile Navbar Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinksList = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle?.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 2. Active Nav Link & Scrolled Header
  const sections = document.querySelectorAll('section, header');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (sectionId && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 3. Theme Color Accent Switcher
  const themeBtns = document.querySelectorAll('.theme-dot');
  const savedAccent = localStorage.getItem('masum_accent_color');

  if (savedAccent) {
    applyAccentColor(savedAccent);
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      applyAccentColor(color);
      localStorage.setItem('masum_accent_color', color);
    });
  });

  function applyAccentColor(color) {
    const root = document.documentElement;
    themeBtns.forEach(b => b.classList.remove('active'));

    if (color === 'cyan') {
      root.style.setProperty('--primary-green', '#00f2fe');
      root.style.setProperty('--primary-hover', '#4facfe');
      root.style.setProperty('--glow-color', 'rgba(0, 242, 254, 0.45)');
      root.style.setProperty('--card-border', 'rgba(0, 242, 254, 0.25)');
    } else if (color === 'purple') {
      root.style.setProperty('--primary-green', '#bf55ec');
      root.style.setProperty('--primary-hover', '#d383f5');
      root.style.setProperty('--glow-color', 'rgba(191, 85, 236, 0.45)');
      root.style.setProperty('--card-border', 'rgba(191, 85, 236, 0.25)');
    } else if (color === 'amber') {
      root.style.setProperty('--primary-green', '#ffb703');
      root.style.setProperty('--primary-hover', '#ffc83b');
      root.style.setProperty('--glow-color', 'rgba(255, 183, 3, 0.45)');
      root.style.setProperty('--card-border', 'rgba(255, 183, 3, 0.25)');
    } else {
      root.style.setProperty('--primary-green', '#6ef028');
      root.style.setProperty('--primary-hover', '#8ced34');
      root.style.setProperty('--glow-color', 'rgba(110, 240, 40, 0.4)');
      root.style.setProperty('--card-border', 'rgba(110, 240, 40, 0.22)');
    }

    const activeBtn = document.querySelector(`.theme-dot[data-color="${color}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  // 4. Ultra Reliable Stats Counter (IntersectionObserver)
  const statsSection = document.querySelector('.stats-bar');
  const statNumbers = document.querySelectorAll('.stat-number');
  let activeAnimIntervals = [];

  if (statsSection && statNumbers.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStatNumbers();
        } else {
          resetStatNumbers();
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
  }

  function animateStatNumbers() {
    activeAnimIntervals.forEach(id => clearInterval(id));
    activeAnimIntervals = [];

    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target') || '0', 10);
      const suffix = num.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 1200;
      const steps = 30;
      const stepTime = Math.floor(duration / steps);
      const stepValue = Math.max(1, Math.ceil(target / steps));

      const intervalId = setInterval(() => {
        count += stepValue;
        if (count >= target) {
          num.innerText = target + suffix;
          clearInterval(intervalId);
        } else {
          num.innerText = count + suffix;
        }
      }, stepTime);

      activeAnimIntervals.push(intervalId);
    });
  }

  function resetStatNumbers() {
    activeAnimIntervals.forEach(id => clearInterval(id));
    activeAnimIntervals = [];
    statNumbers.forEach(num => {
      const suffix = num.getAttribute('data-suffix') || '';
      num.innerText = '0' + suffix;
    });
  }

  // 5. Before vs After Interactive Comparison Slider
  const baSlider = document.getElementById('baSlider');
  const baAfterLayer = document.getElementById('baAfterLayer');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baAfterLayer && baHandle) {
    const updateBASlider = (value) => {
      baAfterLayer.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
      baHandle.style.left = `${value}%`;
    };

    baSlider.addEventListener('input', (e) => updateBASlider(e.target.value));
    baSlider.addEventListener('change', (e) => updateBASlider(e.target.value));

    // Drag anywhere on the image (touch + mouse); iOS range inputs only respond to the thumb otherwise
    let baDragging = false;
    const setFromPointer = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      baSlider.value = percent;
      updateBASlider(percent);
    };

    baSlider.addEventListener('pointerdown', (e) => {
      baDragging = true;
      baSlider.setPointerCapture(e.pointerId);
      setFromPointer(e.clientX);
    });
    baSlider.addEventListener('pointermove', (e) => {
      if (baDragging) setFromPointer(e.clientX);
    });
    const stopDrag = () => { baDragging = false; };
    baSlider.addEventListener('pointerup', stopDrag);
    baSlider.addEventListener('pointercancel', stopDrag);
  }

  // 6. Web Audio API SFX Synthesizer (Instant SFX Preview)
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const sfxBtns = document.querySelectorAll('.sfx-card');
  sfxBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sfxType = btn.getAttribute('data-sfx');
      playSynthesizedSFX(sfxType);

      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 400);
    });
  });

  function playSynthesizedSFX(type) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'whoosh') {
      // Whoosh sound: Noise sweep
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);

    } else if (type === 'chaching') {
      // Cash Register Cha-Ching: Dual High Sine Tones
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      osc2.frequency.setValueAtTime(1318.51, now);
      osc2.frequency.setValueAtTime(1758.4, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);

    } else if (type === 'impact') {
      // Cinematic Impact Hit: Sub Kick + Noise
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

    } else if (type === 'pop') {
      // Pop Subtitle SFX: Short pitch pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // 7. Interactive Live Project Estimator
  const estType = document.getElementById('estType');
  const estLength = document.getElementById('estLength');
  const outTime = document.getElementById('outTime');
  const outRetention = document.getElementById('outRetention');

  function calculateEstimate() {
    if (!estType || !estLength || !outTime || !outRetention) return;

    const type = estType.value;
    const length = estLength.value;

    let timeText = '24 - 48 Hours';
    let retentionText = '+35% Avg Duration';

    if (type === 'shorts') {
      timeText = '24 Hours';
      retentionText = '+60% Completion Rate';
    } else if (type === 'youtube') {
      if (length === 'long') {
        timeText = '3 - 4 Days';
        retentionText = '+45% Avg Duration';
      } else {
        timeText = '2 - 3 Days';
        retentionText = '+35% Avg Duration';
      }
    } else if (type === 'motion') {
      timeText = '48 Hours';
      retentionText = 'High Visual Polish';
    }

    outTime.innerText = timeText;
    outRetention.innerText = retentionText;
  }

  if (estType && estLength) {
    estType.addEventListener('change', calculateEstimate);
    estLength.addEventListener('change', calculateEstimate);
  }

  // 8. Dynamic Portfolio Loading from Admin / LocalStorage
  const PROJECTS_STORAGE_KEY = 'masummz_portfolio_projects';
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentPortfolioFilter = 'all';

  // Helper: Universal Media Parser (Supports YouTube, Vimeo, Drive, Direct MP4 & Images)
  function parseMedia(url, explicitType = null, customThumbnail = null) {
    if (!url) {
      return {
        type: explicitType || 'image',
        provider: 'unknown',
        url: '',
        thumbnailUrl: customThumbnail || '',
        embedUrl: '',
        isEmbed: false
      };
    }

    const cleanUrl = String(url).trim();

    // 1. YouTube (standard, youtu.be, shorts, embed)
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      const defaultThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      return {
        type: 'video',
        provider: 'youtube',
        videoId,
        url: cleanUrl,
        thumbnailUrl: customThumbnail || defaultThumb,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
        isEmbed: true
      };
    }

    // 2. Vimeo
    const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      return {
        type: 'video',
        provider: 'vimeo',
        videoId,
        url: cleanUrl,
        thumbnailUrl: customThumbnail || '',
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
        isEmbed: true
      };
    }

    // 3. Google Drive
    const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      return {
        type: 'video',
        provider: 'gdrive',
        fileId,
        url: cleanUrl,
        thumbnailUrl: customThumbnail || '',
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isEmbed: true
      };
    }

    // 4. Direct video (mp4, webm, mov, m4v, ogg) or explicit type === 'video'
    const isVideoFile = cleanUrl.match(/\.(mp4|webm|mov)($|\?)/i) || explicitType === 'video';
    if (isVideoFile && explicitType !== 'image') {
      return {
        type: 'video',
        provider: 'direct',
        url: cleanUrl,
        thumbnailUrl: customThumbnail || '',
        embedUrl: '',
        isEmbed: false
      };
    }

    // 5. Image
    return {
      type: 'image',
      provider: 'image',
      url: cleanUrl,
      thumbnailUrl: customThumbnail || cleanUrl,
      embedUrl: '',
      isEmbed: false
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const DEFAULT_PORTFOLIO_PROJECTS = [
    {
      id: 'proj_1',
      title: 'Course Promo',
      category: 'video',
      categoryName: 'Talking Head',
      mediaType: 'video',
      mediaUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      desc: 'adobe premiere pro and after effects'
    },
    {
      id: 'proj_2',
      title: 'next jobs',
      category: 'video',
      categoryName: 'Talking Head',
      mediaType: 'video',
      mediaUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
      desc: 'adobe premiere pro and after effects'
    },
    {
      id: 'proj_3',
      title: 'Viral Podcast Clip (Alex Hormozi Style)',
      category: 'shorts',
      categoryName: 'Shorts / Reels',
      mediaType: 'video',
      mediaUrl: 'https://www.youtube.com/shorts/50_uA3P4h5M',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      desc: 'Dynamic subtitles, pop-up graphics, SFX, and high retention cuts.'
    },
    {
      id: 'proj_4',
      title: 'Fitness & Fashion Reels Edit',
      category: 'shorts',
      categoryName: 'Shorts / Reels',
      mediaType: 'video',
      mediaUrl: 'https://www.youtube.com/shorts/aqz-KE-bpKQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      desc: 'Beat synchronization, color enhancement, and energetic motion overlays.'
    },
    {
      id: 'proj_5',
      title: 'High CTR Gaming & Tech Thumbnail',
      category: 'thumbnail',
      categoryName: 'Thumbnail Design',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      desc: 'Vibrant colors, photo manipulation, facial enhancement, and bold text styling.'
    },
    {
      id: 'proj_6',
      title: 'Finance & Crypto YouTube Thumbnail',
      category: 'thumbnail',
      categoryName: 'Thumbnail Design',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
      desc: 'Custom 3D graphic elements, glow effects, and attention-grabbing typography.'
    }
  ];

  function getActiveProjects() {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading portfolio:', e);
    }
    return DEFAULT_PORTFOLIO_PROJECTS;
  }

  // Player URL used when a card's play button is clicked (autoplay because the user clicked)
  function getInlinePlayerSrc(parsed) {
    if (parsed.provider === 'youtube') return `https://www.youtube.com/embed/${parsed.videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
    if (parsed.provider === 'vimeo') return `https://player.vimeo.com/video/${parsed.videoId}?autoplay=1`;
    if (parsed.provider === 'gdrive') return `https://drive.google.com/file/d/${parsed.fileId}/preview`;
    if (parsed.provider === 'direct') return parsed.url;
    return '';
  }

  function buildInlinePlayer(parsed, title, autoplay) {
    const src = getInlinePlayerSrc(parsed);
    if (parsed.provider === 'direct') {
      return `
          <video 
            class="portfolio-video" 
            src="${escapeHtml(src)}" 
            poster="${escapeHtml(parsed.thumbnailUrl || '')}" 
            controls 
            playsinline 
            ${autoplay ? 'autoplay' : 'preload="metadata"'}>
          </video>`;
    }
    const finalSrc = autoplay ? src : src.replace(/([?&])autoplay=1&?/, '$1').replace(/[?&]$/, '');
    return `
          <iframe 
            src="${escapeHtml(finalSrc)}" 
            title="${escapeHtml(title)}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
            allowfullscreen 
            ${autoplay ? '' : 'loading="lazy"'}>
          </iframe>`;
  }

  // Card titles: drop the repeated "| Masum Mz" brand suffix (it's his own portfolio)
  function shortCardTitle(title) {
    const t = String(title || '').replace(/\s*[|\-–—]\s*masum\s*mz\s*$/i, '').trim();
    return t || String(title || '');
  }

  function renderPortfolio() {
    if (!portfolioGrid) return;
    const projects = getActiveProjects();

    portfolioGrid.innerHTML = projects.map(item => {
      const parsed = parseMedia(item.mediaUrl, item.mediaType, item.thumbnailUrl);
      const isVideo = parsed.type === 'video';
      const categoryLabel = item.categoryName || (item.category === 'shorts' ? 'Shorts / Reels' : item.category === 'thumbnail' ? 'Thumbnail Design' : 'Talking Head');

      const playerSrc = getInlinePlayerSrc(parsed);
      const posterSrc = isVideo ? (parsed.thumbnailUrl || '') : '';
      const fallbackPoster = parsed.provider === 'youtube' ? `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg` : '';

      let mediaElement;
      if (isVideo && (posterSrc || parsed.provider === 'direct')) {
        // Clean poster + custom play button. The real player loads only on click.
        const posterImg = posterSrc
          ? `<img class="video-poster-img" src="${escapeHtml(posterSrc)}" ${fallbackPoster && fallbackPoster !== posterSrc ? `data-fallback="${escapeHtml(fallbackPoster)}"` : ''} alt="${escapeHtml(item.title)}" loading="lazy">`
          : '';
        mediaElement = `
          <button type="button" class="video-poster${posterSrc ? '' : ' no-poster'}" aria-label="Play video: ${escapeHtml(item.title)}">
            ${posterImg}
            <span class="video-poster-shade" aria-hidden="true"></span>
            ${categoryLabel ? `<span class="video-tag"><i aria-hidden="true"></i>${escapeHtml(categoryLabel)}</span>` : ''}
            <span class="video-play-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.6-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>
            </span>
            <span class="video-play-hint" aria-hidden="true">Play Video</span>
          </button>`;
      } else if (isVideo && playerSrc) {
        // No thumbnail available (e.g. Vimeo / Drive without cover): show the player directly
        mediaElement = buildInlinePlayer(parsed, item.title, false);
      } else {
        mediaElement = `
          <img 
            src="${escapeHtml(item.thumbnailUrl || item.mediaUrl)}" 
            alt="${escapeHtml(item.title)}" 
            class="portfolio-card-img" 
            loading="lazy">`;
      }

      const metaParts = [];
      if (categoryLabel) metaParts.push(`<span class="meta-cat">${escapeHtml(categoryLabel)}</span>`);
      if (item.desc) metaParts.push(`<span class="meta-desc">${escapeHtml(item.desc)}</span>`);
      const metaHtml = metaParts.length > 0 ? metaParts.join(' <span class="meta-dot">•</span> ') : '';

      return `
        <div class="portfolio-card" data-category="${escapeHtml(item.category)}" data-id="${escapeHtml(item.id)}" data-media-type="${isVideo ? 'video' : 'image'}">
          <div class="portfolio-media">
            ${mediaElement}
          </div>
          <div class="portfolio-info">
            <h3 title="${escapeHtml(item.title)}">${escapeHtml(shortCardTitle(item.title))}</h3>
            ${metaHtml ? `<p class="portfolio-meta">${metaHtml}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

    bindPortfolioCardInteractions();
    applyCategoryFilter(currentPortfolioFilter);
  }

  function bindPortfolioCardInteractions() {
    const cards = document.querySelectorAll('.portfolio-card');

    cards.forEach(card => {
      const mediaType = card.getAttribute('data-media-type');
      const id = card.getAttribute('data-id');

      // Video: clicking the poster swaps it for the real player, playing in place
      const poster = card.querySelector('.video-poster');
      if (poster) {
        const img = poster.querySelector('.video-poster-img');
        if (img) {
          const handleBrokenThumb = () => {
            const fallback = img.getAttribute('data-fallback');
            if (fallback) {
              img.removeAttribute('data-fallback');
              img.src = fallback;
            } else {
              img.remove();
              poster.classList.add('no-poster');
            }
          };
          img.addEventListener('error', handleBrokenThumb);
          if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) handleBrokenThumb();
        }

        poster.addEventListener('click', () => {
          const item = getActiveProjects().find(p => String(p.id) === id);
          if (!item) return;
          stopAllVideos();
          const parsed = parseMedia(item.mediaUrl, item.mediaType, item.thumbnailUrl);
          const media = card.querySelector('.portfolio-media');
          const holder = document.createElement('div');
          holder.className = 'inline-player';
          holder.innerHTML = buildInlinePlayer(parsed, item.title, true);
          media.appendChild(holder);
          card.classList.add('playing');
          const vid = holder.querySelector('video');
          if (vid) {
            const p = vid.play();
            if (p && p.catch) p.catch(() => { /* browser blocked autoplay: controls are visible, user can press play */ });
          }
        });
      }

      // Click to enlarge modal for image / design assets
      if (mediaType === 'image') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          const projects = getActiveProjects();
          const item = projects.find(p => String(p.id) === id);
          if (item) {
            openModal(item.title, item.categoryName || item.category, item.desc, item.mediaUrl, item.mediaType, item.thumbnailUrl);
          } else {
            const title = card.querySelector('h3')?.innerText || 'Portfolio Preview';
            const desc = card.querySelector('.meta-desc')?.innerText || '';
            const category = card.querySelector('.meta-cat')?.innerText || '';
            const mediaSrc = card.querySelector('img')?.getAttribute('src');
            openModal(title, category, desc, mediaSrc, 'image');
          }
        });
      }
    });
  }

  // Stop whatever is playing and put the poster back on those cards
  function stopAllVideos() {
    document.querySelectorAll('.portfolio-card .inline-player').forEach(el => el.remove());
    document.querySelectorAll('.portfolio-video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
    document.querySelectorAll('.portfolio-card').forEach(c => c.classList.remove('playing'));
  }

  function applyCategoryFilter(filterValue) {
    currentPortfolioFilter = filterValue;
    const cards = document.querySelectorAll('.portfolio-card');

    stopAllVideos();

    cards.forEach(item => {

      if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 30);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 200);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCategoryFilter(btn.getAttribute('data-filter'));
    });
  });

  // Listen for storage events (realtime sync across tabs from /admin)
  window.addEventListener('storage', () => {
    renderPortfolio();
  });

  // Initial portfolio render
  renderPortfolio();

  // Live D1 Database sync for worldwide visitors
  async function fetchRemoteProjects() {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          const fresh = JSON.stringify(data.projects);
          let current = null;
          try { current = localStorage.getItem(PROJECTS_STORAGE_KEY); } catch (e) { /* storage blocked */ }
          // Only re-render when something changed, so a video the visitor started keeps playing
          if (fresh === current) return;
          try { localStorage.setItem(PROJECTS_STORAGE_KEY, fresh); } catch (e) { /* storage blocked */ }
          renderPortfolio();
        }
      }
    } catch (e) {
      // Graceful offline / local fallback
    }
  }

  fetchRemoteProjects();

  // 10. Modal Enlarge Video & Image Player
  const modal = document.getElementById('portfolioModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalMediaContainer = document.getElementById('modalMediaContainer');
  const modalClose = document.getElementById('modalClose');

  function openModal(title, category, desc, mediaSrc, mediaType = 'video', customThumbnail = '') {
    if (modalTitle) modalTitle.innerText = title;
    if (modalCategory) modalCategory.innerText = category.toUpperCase();
    if (modalDesc) modalDesc.innerText = desc;

    if (modalMediaContainer) {
      if (mediaSrc) {
        const parsed = parseMedia(mediaSrc, mediaType, customThumbnail);

        if (parsed.type === 'image') {
          modalMediaContainer.innerHTML = `
            <div class="modal-image-wrapper" style="text-align:center;max-height:500px;display:flex;align-items:center;justify-content:center;">
              <img src="${mediaSrc}" alt="${escapeHtml(title)}" class="modal-large-img" style="max-width:100%;max-height:480px;border-radius:10px;object-fit:contain;">
            </div>
          `;
        } else if (parsed.isEmbed) {
          modalMediaContainer.innerHTML = `
            <div class="modal-iframe-wrapper">
              <iframe src="${parsed.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="modal-large-iframe"></iframe>
            </div>
          `;
        } else {
          modalMediaContainer.innerHTML = `
            <div class="modal-video-wrapper">
              <video src="${mediaSrc}" poster="${parsed.thumbnailUrl || ''}" controls autoplay playsinline class="modal-large-video"></video>
            </div>
          `;
        }
      } else {
        modalMediaContainer.innerHTML = `
          <div class="modal-placeholder-preview">
            <i class="fa-solid fa-play-circle modal-play-icon"></i>
            <p>Preview for <strong>${escapeHtml(title)}</strong></p>
          </div>
        `;
      }
    }

    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (modalMediaContainer) {
        const modalVid = modalMediaContainer.querySelector('video');
        if (modalVid) modalVid.pause();
        modalMediaContainer.innerHTML = '';
      }
    }
  }

  // 11. Copy to Clipboard & Toast Notification
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        });
      }
    });
  });

  function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 12. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formSuccess = document.getElementById('formSuccess');
      if (formSuccess) {
        formSuccess.style.display = 'flex';
        contactForm.reset();
        showToast('Message sent successfully!');
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }
    });
  }

  // 13. Back to Top Smooth Scroll
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
