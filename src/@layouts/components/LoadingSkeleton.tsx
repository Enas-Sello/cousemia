const LoadingSkeleton = () => {
  return (
    <div
      className='animate__animated animate__fadeOut'
      style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
    >
      <div className='space-y-4'>
        <div className='h-6 bg-gray-50 rounded w-3/4  animate-pulse'></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
