'use client'

import { useContext, useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Loader2Icon } from 'lucide-react'
import { UserSubscriptionContext } from '@/app/(contenxt)/UserSubscription'

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        priceMonthly: '₹0',
        description: 'Start your journey with 10,000 monthly credits. Ideal for individuals and small experiments.',
        features: ['10,000 monthly credits', 'Basic analytics', 'Community support'],
        featured: false,
        isPaid: false,
    },
    {
        name: 'Premium',
        id: 'tier-premium',
        priceMonthly: '₹399',
        description: 'Unlimited credits and full access to premium features. Best for growing businesses.',
        features: [
            'Unlimited credits',
            'Advanced analytics',
            'Priority support',
            'Marketing automations',
            'Custom integrations',
        ],
        featured: true,
        isPaid: true,
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function PricingSection() {
    const [loading, setLoading] = useState(false)
    const { userSubscription } = useContext(UserSubscriptionContext)

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (document.querySelector('#razorpay-script')) return resolve(true)

            const script = document.createElement('script')
            script.id = 'razorpay-script'
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const OnPayment = async (subId: string) => {
        const loaded = await loadRazorpayScript()
        if (!loaded) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            subscription_id: subId,
            name: 'AICGEN',
            description: 'Monthly Premium Subscription',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async function (response: any) {
                if (response?.razorpay_subscription_id) {
                    try {
                        const res = await fetch('/api/save-subscription', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                paymentId: response.razorpay_subscription_id,
                            }),
                        })

                        const data = await res.json()
                        if (!res.ok) {
                            console.error('Failed to save subscription:', data.error)
                        } else {
                            console.log('Subscription saved:', data)
                            window.location.reload()
                        }
                    } catch (err) {
                        console.error('API error while saving subscription:', err)
                    }
                }
            },
            theme: {
                color: '#6366f1',
            },
        }

        // @ts-expect-error: Razorpay is a global script and not typed
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const CreateSubscription = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/create-subscription', {
                method: 'POST',
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            await OnPayment(data.id)
        } catch (error) {
            console.error('Payment initiation failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative isolate flex-[1] px-4 py-8 sm:px-6 lg:px-8 h-full bg-white flex flex-col justify-center">
            <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-sm font-semibold text-indigo-600">Pricing</h2>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-gray-900">Choose the right plan for you</p>
                <p className="mt-2 text-base text-gray-600">
                    Get started with AICGEN for free or unlock unlimited power with Premium.
                </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60',
                            'rounded-3xl p-6 ring-1 ring-gray-900/10 flex flex-col justify-between'
                        )}
                    >
                        <div>
                            <h3
                                id={tier.id}
                                className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base font-semibold')}
                            >
                                {tier.name}
                            </h3>
                            <p className="mt-2 flex items-baseline gap-x-1">
                                <span className={classNames(tier.featured ? 'text-white' : 'text-gray-900', 'text-4xl font-semibold')}>
                                    {tier.priceMonthly}
                                </span>
                                <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-sm')}>/month</span>
                            </p>
                            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-3 text-sm')}>
                                {tier.description}
                            </p>
                            <ul
                                role="list"
                                className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-4 space-y-2 text-sm')}
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-2">
                                        <CheckIcon
                                            aria-hidden="true"
                                            className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-5 w-5 flex-none')}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            disabled={loading}
                            aria-describedby={tier.id}
                            onClick={(e) => {
                                if (userSubscription) {
                                    e.preventDefault()
                                    console.log('Already subscribed.')
                                    return
                                }
                                e.preventDefault()
                                if (tier.isPaid) {
                                    CreateSubscription()
                                } else {
                                    console.log('Free plan selected. No payment required.')
                                    // Optional: Redirect or set local storage to mark plan
                                }
                            }}
                            className={classNames(
                                tier.featured
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                                'mt-6 flex items-center justify-center gap-x-2 rounded-md px-3 py-2 text-center text-sm font-semibold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600'
                            )}
                        >
                            {loading && tier.isPaid && <Loader2Icon className="animate-spin" />}
                            {tier.name === 'Free' ? 'It is free' : userSubscription ? 'Subscribed' : tier.isPaid ? 'Get started today' : 'Start for free'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
