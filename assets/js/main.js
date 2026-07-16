/* =====================================================================
   HOUSE OF H3 — SHARED SCRIPT
   Loaded on every page. Each block guards itself so it only runs when
   the relevant elements exist on the current page.
===================================================================== */
(function(){
  "use strict";

  /* ---------- Sticky / blurred nav on scroll ---------- */
  var nav = document.getElementById('siteNav');
  if (nav){
    var onScroll = function(){
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('hamburgerBtn');
  var panel = document.getElementById('mobilePanel');
  if (burger && panel){
    var closeMenu = function(){
      burger.classList.remove('open');
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', function(){
      var isOpen = panel.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Active nav-item indicator ---------- */
  /* Each <body> declares data-page="home|our-story|fragrances|collection|pre-order|contact"
     Each nav link declares data-nav="the same value" */
  var currentPage = document.body.getAttribute('data-page');
  if (currentPage){
    document.querySelectorAll('[data-nav]').forEach(function(link){
      if (link.getAttribute('data-nav') === currentPage){
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length){
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('is-visible'); });
    }
  }

  /* ---------- Product image auto-detect (Collection page) ----------
     Each .product-media contains an <img> and a .media-placeholder.
     If the image loads successfully, the placeholder is hidden.
     If it fails (file not added yet), the broken image is removed and
     the placeholder stays visible — no broken-image icon is ever shown. */
  document.querySelectorAll('.product-media img').forEach(function(img){
    var media = img.closest('.product-media');
    if (!media) return;
    if (img.complete && img.naturalWidth > 0){
      media.classList.add('has-image');
    }
    img.addEventListener('load', function(){
      if (img.naturalWidth > 0) media.classList.add('has-image');
    });
    img.addEventListener('error', function(){
      media.classList.add('no-image');
      img.remove();
    });
  });

  /* ---------- Pre-Order & Enquiry form -> WhatsApp ---------- */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm){
    var note = document.getElementById('enquiryNote');
    var WHATSAPP_NUMBER = '917384875992'; // +91 73848 75992

    enquiryForm.addEventListener('submit', function(e){
      e.preventDefault();

      var name = document.getElementById('fullName').value.trim();
      var phone = document.getElementById('phoneNumber').value.trim();
      var whatsapp = document.getElementById('whatsappNumber').value.trim();
      var email = document.getElementById('emailAddress').value.trim();
      var city = document.getElementById('city').value.trim();
      var fragrance = document.getElementById('fragranceInterest').value;
      var enquiryType = document.getElementById('enquiryType').value;
      var message = document.getElementById('message').value.trim();
      var consent = document.getElementById('consentCheck').checked;

      if (!name || !phone || !email || !city || !fragrance || !enquiryType){
        note.textContent = 'Please complete all required fields before submitting.';
        note.classList.add('error');
        return;
      }
      if (!consent){
        note.textContent = 'Please agree to be contacted before submitting.';
        note.classList.add('error');
        return;
      }

      note.classList.remove('error');
      note.textContent = 'Opening WhatsApp with your enquiry...';

      var lines = [
        'HOUSE OF H3 — NEW ENQUIRY',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'WhatsApp: ' + (whatsapp || phone),
        'Email: ' + email,
        'City: ' + city,
        'Fragrance: ' + fragrance,
        'Enquiry Type: ' + enquiryType,
        'Message: ' + (message || '—')
      ];

      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
      window.open(url, '_blank', 'noopener');
    });
  }

})();
