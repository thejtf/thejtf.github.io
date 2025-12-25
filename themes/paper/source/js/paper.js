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
  
  // 时间显示逻辑已移至 location-bar.pug 的内联脚本中，避免闪烁
})
