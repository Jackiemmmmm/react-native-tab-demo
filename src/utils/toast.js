import Toast from '../components/Toast';
export * from '../components/Toast';
const toast = (msg, duration, color, options = {
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  position: 'top',
  visible: true
})=>{
  return Toast.show(msg, {
    duration: duration,
    backgroundColor: color || '#000',
    ...options
  });
};

export default toast;
