/* ============================================
   KATRAN DERGİ — ÜST BAR GİRİŞ/AVATAR
   Her sayfaya <script src="auth-bar.js"></script> ile eklenir.
   Sayfanın kendi Supabase kodundan bağımsız çalışır.
   ============================================ */
(function() {
  'use strict';

  var KATRAN_SUPABASE_URL = 'https://bdxvgtxregsonbvhvdav.supabase.co';
  var KATRAN_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeHZndHhyZWdzb25idmh2ZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MzM4ODcsImV4cCI6MjEwNTAwOTg4N30.7gQGqcvDzTKpQyjnRkmcCrwPny3m5pfUOy4BWk7O0CQ';

  function paint(profile) {
    var link = document.getElementById('authLink');
    if (!link || !profile) return;
    var name = profile.full_name || profile.username || 'Üye';
    link.href = 'profil.html';
    link.title = name;
    if (window.renderAvatar) {
      link.innerHTML = window.renderAvatar(profile, 36);
      link.classList.remove('avatar-login-btn');
    } else {
      var span = document.getElementById('authText');
      if (span) span.textContent = String(name).split(' ')[0];
    }
  }

  function getClient() {
    try {
      if (window.supabaseClient) return window.supabaseClient;
    } catch (e) {}
    if (!window.supabase) return null;
    try {
      window.supabaseClient = window.supabase.createClient(KATRAN_SUPABASE_URL, KATRAN_SUPABASE_KEY);
      return window.supabaseClient;
    } catch (e) {
      return null;
    }
  }

  async function init() {
    try {
      var client = getClient();
      if (!client) return;
      var res = await client.auth.getSession();
      var session = res.data.session;
      if (!session) return;
      var r = await client
        .from('profiles')
        .select('full_name, username, avatar, status')
        .eq('id', session.user.id)
        .single();
      if (r.data && r.data.status !== 'pending') paint(r.data);
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
