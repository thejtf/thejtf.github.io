// dark mode utils
const invertImgs = (function() {
  const invertImg = img =>
    (img.style.filter =
      img.style.filter !== 'invert(100%)' ? 'invert(100%)' : '')
  const invertImgs = imgs => Array.prototype.forEach.call(imgs, invertImg)
  return invertImgs
})()

function Darkmode() {
  this.mask = document.getElementById('darkmode-mask')
  this.imgs = document.getElementsByTagName('img')
  this.metaThemeColor = document.querySelector('meta[name=theme-color]')
  this.metaThemeColorCatch = ''
}
Darkmode.prototype.turnOnDarkmode = function() {
  // fix chrome bug
  document.querySelector('html').style.background = '#ffffff'
  this.mask.classList.add('darkmode-mask--dark')
  // invert the images color
  // so that they can render with the right color
  invertImgs(this.imgs)

  // set <meta name="theme-color" content="xxxx">
  this.metaThemeColorCatch = this.metaThemeColor.content
  this.metaThemeColor.setAttribute('content', '#333') // dark-mode tab color #333
}
Darkmode.prototype.turnOffDarkmode = function() {
  this.mask.classList.remove('darkmode-mask--dark')
  invertImgs(this.imgs)
  this.metaThemeColor.content = this.metaThemeColorCatch
}

window.addEventListener('DOMContentLoaded', () => {
  // darkmode
  ;(() => {
    const darkmode = new Darkmode()
    const checkbox = document.querySelector('input[name=mode]')
    if (!checkbox) return
    
    try {
      const isDarkMode = localStorage.getItem('isDarkMode')
      if (isDarkMode && JSON.parse(isDarkMode)) {
        darkmode.turnOnDarkmode()
        checkbox.checked = true
      }
    } catch (e) {
      // 如果 localStorage 值无效，忽略错误
      console.warn('Failed to parse darkMode from localStorage:', e)
    }
    
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        darkmode.turnOnDarkmode()
        localStorage.setItem('isDarkMode', 'true')
      } else {
        darkmode.turnOffDarkmode()
        localStorage.setItem('isDarkMode', 'false')
      }
    })
  })()

  // sidebar
  ;(() => {
    let toggle = true
    const sidebar = document.querySelector('.sidebar')
    const sidebarButton = document.querySelector('.sidebar__button')
    sidebarButton && sidebarButton.addEventListener('click', function() {
      toggle
        ? sidebar.classList.add('sidebar--expend')
        : sidebar.classList.remove('sidebar--expend')
      toggle
        ? sidebarButton.classList.add('sidebar__button--expend')
        : sidebarButton.classList.remove('sidebar__button--expend')
      toggle = !toggle
    })
  })()

  // weekday display - 动态显示当前星期几
  // 获取星期几的函数，可以在需要的地方调用
  // 使用方法：getWeekday() 返回 '周日'、'周一'、'周二'、'周三'、'周四'、'周五'、'周六'
  window.getWeekday = function() {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();
    return days[today.getDay()];
  }
  
  // 根据日期动态切换主题色
  ;(() => {
    // #region agent log
    fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:DOMContentLoaded:start',message:'DOMContentLoaded theme color handler started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    function getThemeColorByDate() {
      const now = new Date();
      const month = now.getMonth() + 1; // 0-11 -> 1-12
      const date = now.getDate();
      const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      
      // #region agent log
      fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:getThemeColorByDate',message:'Date calculation in DOMContentLoaded',data:{month:month,date:date,dayOfWeek:dayOfWeek},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      // 特殊纪念日：4月4日、4月5日、9月18日、12月13日
      const memorialDays = [
        { month: 4, date: 4 },
        { month: 4, date: 5 },
        { month: 9, date: 18 },
        { month: 12, date: 13 }
      ];
      
      // 检查是否是纪念日
      const isMemorialDay = memorialDays.some(day => day.month === month && day.date === date);
      if (isMemorialDay) {
        return { name: 'gray', color: '#cccccc' };
      }
      
      // 根据星期几返回对应的主题色
      // 周一Monday：default (金黄色), 周二Tuesday：grass (草绿色), 周三Wednesday：forest (森林绿)
      // 周四Thursday：sky (天空蓝), 周五Friday：sea (海洋蓝), 周六Saturday：red (红色), 周日Sunday：sun (太阳橙)
      const weekdayColorMap = {
        1: { name: 'default', color: '#ebc65a' },   // Monday
        2: { name: 'grass', color: '#9dab86' },      // Tuesday
        3: { name: 'forest', color: '#6ba8a9' },    // Wednesday
        4: { name: 'sky', color: '#9be3de' },       // Thursday
        5: { name: 'sea', color: '#46b3e6' },       // Friday
        6: { name: 'red', color: '#FF585B' },       // Saturday
        0: { name: 'sun', color: '#ffa259' }        // Sunday
      };
      
      return weekdayColorMap[dayOfWeek] || weekdayColorMap[1];
    }
    
    function applyThemeColor(themeColor) {
      const colorMain = themeColor.color;
      
      // #region agent log
      fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:applyThemeColor',message:'Before applying theme color',data:{colorMain:colorMain,hasEarlyStyle:!!document.getElementById('dynamic-theme-color-early')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      // 更新 CSS 变量
      document.documentElement.style.setProperty('--color-main', colorMain);
      
      // 计算辅助色（主色调的85%淡化版本）
      const hex = themeColor.color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const lightenR = Math.round(r + (255 - r) * 0.85);
      const lightenG = Math.round(g + (255 - g) * 0.85);
      const lightenB = Math.round(b + (255 - b) * 0.85);
      const auxiliaryColor = `#${lightenR.toString(16).padStart(2, '0')}${lightenG.toString(16).padStart(2, '0')}${lightenB.toString(16).padStart(2, '0')}`;
      document.documentElement.style.setProperty('--color-auxiliary', auxiliaryColor);
      
      // 更新 meta theme-color
      const metaThemeColor = document.querySelector('meta[name=theme-color]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', colorMain);
      }
      
      // 移除早期注入的样式（如果存在）
      const earlyStyle = document.getElementById('dynamic-theme-color-early');
      if (earlyStyle) {
        earlyStyle.remove();
        // #region agent log
        fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:applyThemeColor',message:'Removed early style',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
      }
      
      // 通过动态样式更新所有使用主题色的元素
      const style = document.createElement('style');
      style.id = 'dynamic-theme-color';
      style.textContent = `
        .mask-border::before {
          border-color: ${colorMain} !important;
        }
        .footer {
          background: ${colorMain} !important;
        }
        .sidebar__button {
          background: ${colorMain} !important;
        }
        .sidebar {
          border-color: ${colorMain} !important;
        }
        .paginator .extend {
          background: ${colorMain} !important;
        }
        .toc a {
          background: ${colorMain} !important;
        }
        .tocbot .is-active-link::before {
          background: ${colorMain} !important;
        }
        .toc-link::before {
          background-color: #EEE !important;
        }
        .sidebar__link a:hover,
        .sidebar__archives a:hover,
        .sidebar__categories a:hover,
        .sidebar__tags a:hover {
          box-shadow: inset 0 -0.8em 0 ${colorMain} !important;
        }
        .post__title a {
          box-shadow: inset 0 -0.8em 0 ${colorMain} !important;
        }
        .posts-item__title a {
          box-shadow: inset 0 -0.3em 0 ${colorMain} !important;
        }
        .posts-item:hover h2.posts-item__title a {
          box-shadow: inset 0 -0.8em 0 ${colorMain} !important;
        }
        .post__content a {
          border-color: ${colorMain} !important;
          box-shadow: 0.2em 0.2em 0 0 ${colorMain} !important;
        }
        article.post-view__article .article__content a:hover {
          box-shadow: inset 0 -0.8em 0 ${colorMain} !important;
        }
        article.post-view__article .article__content code:not(.hljs) {
          border-color: ${colorMain} !important;
          box-shadow: 0.2em 0.2em 0 0 ${colorMain} !important;
        }
      `;
      
      // 移除旧的动态样式
      const oldStyle = document.getElementById('dynamic-theme-color');
      if (oldStyle) oldStyle.remove();
      
      document.head.appendChild(style);
      
      // #region agent log
      fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:applyThemeColor',message:'Dynamic style applied',data:{colorMain:colorMain,styleId:style.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
    }
    
    // 应用主题色
    const themeColor = getThemeColorByDate();
    applyThemeColor(themeColor);
    
    // #region agent log
    fetch('http://localhost:7245/ingest/5d94b100-e12a-4321-900b-603cc60d9f37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'paper.js:DOMContentLoaded:end',message:'DOMContentLoaded theme color handler completed',data:{themeColor:themeColor.color},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  })()
  
  // 时间显示逻辑已移至 location-bar.pug 的内联脚本中，避免闪烁
})
