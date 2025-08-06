'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardDocumentIcon,
  BackspaceIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [copied, setCopied] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '%':
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(display)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    ...props 
  }: {
    onClick: () => void
    className?: string
    children: React.ReactNode
  }) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center justify-center rounded-lg p-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )

  return (
    <div className="space-y-4">
      {/* 顯示屏 */}
      <div className="relative">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
          <div className="text-right text-2xl font-mono text-gray-900 dark:text-white">
            {display}
          </div>
        </div>
        
        {/* 複製按鈕 */}
        <button
          onClick={copyResult}
          className="absolute right-2 top-2 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          title="複製結果"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 按鈕區域 */}
      <div className="grid grid-cols-4 gap-2">
        {/* 第一行 */}
        <Button
          onClick={clear}
          className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
          C
        </Button>
        <Button
          onClick={backspace}
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          <BackspaceIcon className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => performOperation('%')}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          %
        </Button>
        <Button
          onClick={() => performOperation('÷')}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          ÷
        </Button>

        {/* 第二行 */}
        <Button
          onClick={() => inputNumber('7')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          7
        </Button>
        <Button
          onClick={() => inputNumber('8')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          8
        </Button>
        <Button
          onClick={() => inputNumber('9')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          9
        </Button>
        <Button
          onClick={() => performOperation('×')}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          ×
        </Button>

        {/* 第三行 */}
        <Button
          onClick={() => inputNumber('4')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          4
        </Button>
        <Button
          onClick={() => inputNumber('5')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          5
        </Button>
        <Button
          onClick={() => inputNumber('6')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          6
        </Button>
        <Button
          onClick={() => performOperation('-')}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          -
        </Button>

        {/* 第四行 */}
        <Button
          onClick={() => inputNumber('1')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          1
        </Button>
        <Button
          onClick={() => inputNumber('2')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          2
        </Button>
        <Button
          onClick={() => inputNumber('3')}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          3
        </Button>
        <Button
          onClick={() => performOperation('+')}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          +
        </Button>

        {/* 第五行 */}
        <Button
          onClick={() => inputNumber('0')}
          className="col-span-2 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          0
        </Button>
        <Button
          onClick={inputDecimal}
          className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
        >
          .
        </Button>
        <Button
          onClick={performCalculation}
          className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          =
        </Button>
      </div>
    </div>
  )
}
