document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const mainContent = document.querySelector('.main-content');
  const overlay = document.querySelector('.sidebar-overlay');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');

  // Desktop toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
      
      if (mainContent && window.innerWidth > 768) {
        if (isCollapsed) {
          mainContent.style.marginLeft = '70px';
          mainContent.style.width = 'calc(100% - 70px)';
        } else {
          mainContent.style.marginLeft = '260px';
          mainContent.style.width = 'calc(100% - 260px)';
        }
      }
    });
  }

  // Mobile menu toggle - FIXED
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = sidebar.classList.contains('open');
      
      if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close sidebar when clicking a nav link on mobile
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Restore saved sidebar state on desktop
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    if (mainContent) {
      mainContent.style.marginLeft = '70px';
      mainContent.style.width = 'calc(100% - 70px)';
    }
  } else if (window.innerWidth > 768 && mainContent) {
    mainContent.style.marginLeft = '260px';
    mainContent.style.width = 'calc(100% - 260px)';
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth <= 768) {
        // Mobile mode
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (mainContent) {
          mainContent.style.marginLeft = '0';
          mainContent.style.width = '100%';
        }
      } else {
        // Desktop mode
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (mainContent) {
          if (isCollapsed) {
            mainContent.style.marginLeft = '70px';
            mainContent.style.width = 'calc(100% - 70px)';
          } else {
            mainContent.style.marginLeft = '260px';
            mainContent.style.width = 'calc(100% - 260px)';
          }
        }
      }
    }, 100);
  });

  // Set active nav item based on current page
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
      item.classList.add('active');
    }
  });
});
