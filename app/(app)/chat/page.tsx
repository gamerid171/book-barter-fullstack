'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Search, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react'

// Mock data - replace with actual data fetching
const mockOtherUser = {
  id: '2',
  name: 'John Doe',
  username: 'johndoe',
  avatar: '/placeholder-avatar.png',
  city: 'San Francisco',
  online: true
}

const mockBook = {
  id: '1',
  title: 'To Kill a Mockingbird',
  authors: ['Harper Lee'],
  coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  conditionGrade: 'LIKE_NEW',
  photos: {
    front: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    back: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    spine: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    edge: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
  }
}

const mockMessages = [
  {
    id: '1',
    senderId: '2',
    content: "Hi! I'm interested in this book. Is it still available?",
    timestamp: new Date('2024-01-20T10:00:00'),
    read: true
  },
  {
    id: '2',
    senderId: '1',
    content: "Yes, it's still available! The book is in like-new condition, as you can see from the photos.",
    timestamp: new Date('2024-01-20T10:05:00'),
    read: true
  },
  {
    id: '3',
    senderId: '2',
    content: "Great! I have a few books I could trade for it. Would you be interested in 'The Great Gatsby'?",
    timestamp: new Date('2024-01-20T10:10:00'),
    read: true
  },
  {
    id: '4',
    senderId: '1',
    content: "Sure! I'd be open to that. Let me check the condition of your copy.",
    timestamp: new Date('2024-01-20T10:15:00'),
    read: true
  },
  {
    id: '5',
    senderId: '2',
    content: "Sounds good! When would be a good time to meet up for the exchange?",
    timestamp: new Date('2024-01-20T10:20:00'),
    read: false
  }
]

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        senderId: '1',
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false
      }
      setMessages([...messages, message])
      setNewMessage('')

      // Simulate typing indicator and response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const response = {
          id: (Date.now() + 1).toString(),
          senderId: '2',
          content: "Thanks for the message! I'll get back to you soon.",
          timestamp: new Date(),
          read: false
        }
        setMessages(prev => [...prev, response])
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/trades"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={mockOtherUser.avatar}
                    alt={mockOtherUser.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  {mockOtherUser.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{mockOtherUser.name}</h3>
                  <p className="text-sm text-gray-500">{mockOtherUser.city}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.senderId === '1' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.senderId === '1'
                      ? 'bg-green-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-2 ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  {message.senderId === '1' && (
                    <span className="text-xs text-gray-500">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Book Details */}
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h2>

          <div className="relative group cursor-pointer mb-4" onClick={() => setSelectedImage(mockBook.coverUrl)}>
            <Image
              src={mockBook.coverUrl}
              alt={mockBook.title}
              width={200}
              height={300}
              className="w-full rounded-lg shadow-md object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-3 py-1 text-sm font-medium">
                Click to enlarge
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 text-lg mb-1">{mockBook.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{mockBook.authors.join(', ')}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Condition:</span>
              <span className="text-sm text-gray-900 capitalize">{mockBook.conditionGrade.replace('_', ' ')}</span>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Photos:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(mockBook.photos).map(([type, url]) => (
                  <div
                    key={type}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                  >
                    <Image
                      src={url}
                      alt={`Book ${type}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white rounded p-1">
                          <Search className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Book preview"
              width={800}
              height={1200}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}