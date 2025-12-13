document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const mainContent = document.querySelector('.main-content');
  const overlay = document.querySelector('.sidebar-overlay');

  // Toggle sidebar on desktop
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // Store preference
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
      
      // Update main content immediately
      if (mainContent) {
        if (isCollapsed) {
          mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
          mainContent.style.width = 'calc(100% - var(--sidebar-collapsed-width))';
        } else {
          mainContent.style.marginLeft = 'var(--sidebar-width)';
          mainContent.style.width = 'calc(100% - var(--sidebar-width))';
        }
      }
    });
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
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

  // Restore saved sidebar state on desktop
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    if (mainContent) {
      mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
      mainContent.style.width = 'calc(100% - var(--sidebar-collapsed-width))';
    }
  } else if (window.innerWidth > 768 && mainContent) {
    mainContent.style.marginLeft = 'var(--sidebar-width)';
    mainContent.style.width = 'calc(100% - var(--sidebar-width))';
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      // Mobile mode
      sidebar.classList.remove('collapsed');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
      }
    } else {
      // Desktop mode
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (mainContent) {
        if (isCollapsed) {
          mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
          mainContent.style.width = 'calc(100% - var(--sidebar-collapsed-width))';
        } else {
          mainContent.style.marginLeft = 'var(--sidebar-width)';
          mainContent.style.width = 'calc(100% - var(--sidebar-width))';
        }
      }
    }
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
