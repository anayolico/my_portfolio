import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BackgroundAudio from './components/BackgroundAudio.jsx'
import SupportModal from './components/SupportModal.jsx'
import { fetchFromApi } from './services/api.js'

/* Layout: wraps pages and provides header/footer */
export default function Layout({children}){
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [supportInitialAmount, setSupportInitialAmount] = useState(2000)
  const [supportSuccessData, setSupportSuccessData] = useState(null)

  useEffect(() => {
    const handleOpenSupport = (e) => {
      setSupportSuccessData(null)
      const amt = e?.detail?.amount
      if (amt !== undefined && amt !== null) {
        setSupportInitialAmount(amt)
      } else {
        setSupportInitialAmount(2000)
      }
      setSupportModalOpen(true)
    }

    window.addEventListener('open_support_modal', handleOpenSupport)
    return () => window.removeEventListener('open_support_modal', handleOpenSupport)
  }, [])

  // Handle Paystack redirect back to /checkout-success?reference=...
  useEffect(() => {
    const path = window.location.pathname.toLowerCase()
    if (!path.startsWith('/checkout-success')) return

    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference') || params.get('trxref')
    if (!reference) {
      window.history.replaceState({}, '', '/')
      return
    }

    async function verifyReturnPayment() {
      const data = await fetchFromApi(`/api/paystack/verify/${encodeURIComponent(reference)}`)
      window.history.replaceState({}, '', '/')
      if (data && data.verified && data.type === 'support') {
        setSupportSuccessData({
          amount: Number(data.amount) || 2000,
          reference: data.reference || reference,
        })
        setSupportModalOpen(true)
      } else if (data && data.verified && data.type === 'source_code') {
        const successPayload = {
          item: {
            title: data.projectTitle || 'Source Code Package',
            price: Number(data.amount) || 15000,
            download_link: data.downloadUrl || '',
          },
          ref: data.reference || reference,
          downloadUrl: data.downloadUrl || '',
          buyerEmail: data.email || '',
        }
        window.__pendingSourceCodeSuccess = successPayload
        window.dispatchEvent(new CustomEvent('source_code_checkout_success', { detail: successPayload }))
      }
    }

    verifyReturnPayment()
  }, [])

  const handleCloseSupportModal = () => {
    setSupportModalOpen(false)
    setSupportSuccessData(null)
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      
      {/* Background music control (floating button) - using free Pixabay music */}
      <BackgroundAudio />
      <Header />
      <div className="flex-1 container mx-auto px-2 sm:px-6 md:px-12 py-12 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
      <Footer />
      <SupportModal
        isOpen={supportModalOpen}
        onClose={handleCloseSupportModal}
        initialAmount={supportInitialAmount}
        initialSuccessData={supportSuccessData}
      />
    </div>
  )
}

