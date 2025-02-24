import React from 'react'

const Info = () => {
  return (
    <div className='min-h-screen p-8 relative z-0 mt-5'> {/* z-index ve margin-top eklendi */}
      {/* Başlık Bölümü */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-white mb-4'>Save Your Time</h1>
        <p className='text-gray-300 text-lg'>Stay productive with one app.</p>
      </div>

      {/* Ana İçerik - İki Bölümlü Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'>
        
        {/* Sol Bölüm */}
        <div className='bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300'> {/* hover efekti eklendi */}
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Task Flow</h2>
          <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
              <span className='mr-2'>🎯</span>
              Pomodoro Tekniği ile Odaklanma
            </li>
            <li className='flex items-center'>
              <span className='mr-2'>📝</span>
              Görev Yönetimi
            </li>
            <li className='flex items-center'>
              <span className='mr-2'>⏱️</span>
              Zaman Takibi
            </li>
          </ul>
        </div>
        <div className='bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300'> {/* hover efekti eklendi */}
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Time Tracker</h2>
          <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
              <span className='mr-2'>🎯</span>
              Pomodoro Tekniği ile Odaklanma
            </li>
            <li className='flex items-center'>
              <span className='mr-2'>📝</span>
              Görev Yönetimi
            </li>
            <li className='flex items-center'>
              <span className='mr-2'>⏱️</span>
              Zaman Takibi
            </li>
          </ul>
        </div>

        {/* Sağ Bölüm */}
        <div className='bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300'> {/* hover efekti eklendi */}
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Pomodoro</h2>
          <div className='space-y-4 text-gray-300'>
            <div className='flex items-center justify-between'>
              <span>Günlük Odaklanma</span>
              <span className='text-[#52D3D8]'>2 saat 30 dk</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Tamamlanan Görevler</span>
              <span className='text-[#52D3D8]'>12</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Verimlilik Skoru</span>
              <span className='text-[#52D3D8]'>85%</span>
            </div>
          </div>
        </div>
        <div className='bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300'> {/* hover efekti eklendi */}
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Timer</h2>
          <div className='space-y-4 text-gray-300'>
            <div className='flex items-center justify-between'>
              <span>Günlük Odaklanma</span>
              <span className='text-[#52D3D8]'>2 saat 30 dk</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Tamamlanan Görevler</span>
              <span className='text-[#52D3D8]'>12</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Verimlilik Skoru</span>
              <span className='text-[#52D3D8]'>85%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Info