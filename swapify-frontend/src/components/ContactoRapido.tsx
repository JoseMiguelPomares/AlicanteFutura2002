import { Mail, Phone } from "lucide-react"

const ContactoRapido = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-2">
        <a
          href="mailto:info@swapify.com"
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition duration-300"
          aria-label="Enviar email"
        >
          <Mail className="h-6 w-6" />
        </a>
        <a
          href="tel:+34912345678"
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition duration-300"
          aria-label="Llamar por teléfono"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
    </div>
  )
}

export default ContactoRapido
