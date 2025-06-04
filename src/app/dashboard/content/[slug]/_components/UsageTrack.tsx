"use client"
import { TotalUsageContext } from '@/app/(contenxt)/TotalUsageContext';
import { UserSubscriptionContext } from '@/app/(contenxt)/UserSubscription';
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const UsageTrack = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isLoaded } = useUser();

  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);

  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext)
  const router = useRouter();

  useEffect(() => {
    const fetchUsage = async () => {
      if (!isLoaded || !user) return;

      setIsLoading(true);
      try {
        const [usageResponse, subscriptionResponse] = await Promise.all([
          fetch('/api/usage'),
          fetch('/api/is-subscribed'),
        ]);

        if (!usageResponse.ok || !subscriptionResponse.ok) {
          throw new Error('Failed to fetch usage or subscription data');
        }

        const subscriptionData = await subscriptionResponse.json();

        if (subscriptionData.subscribed) {
          setUserSubscription(true);
        } else {
          setUserSubscription(false);
        }

        const usageData = await usageResponse.json();
        setTotalUsage(usageData.totalUsage || 0);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
        setTotalUsage(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsage();
  }, [user, isLoaded, setTotalUsage, setUserSubscription]);

  useEffect(() => {
  }, [userSubscription]);

  let maxCredits = null;
  let usagePercentage = 0;
  if (!userSubscription) {
    maxCredits = 10000;
    usagePercentage = Math.min((totalUsage / maxCredits) * 100, 100);
  } else {
    maxCredits = "Unlimited";
  }


  return (
    <div>
      <div className='bg-indigo-500 text-white p-3 rounded-lg'>
        <h2 className='font-medium'>Credits</h2>
        {!userSubscription &&
          <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
            <div
              className='h-2 bg-white rounded-full transition-all duration-300'
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        }
        
        <h2 className='text-sm mt-2'>
          {isLoading ? 'Loading...' : !userSubscription ? `${Math.min(totalUsage, Number(maxCredits)).toLocaleString()}/${Number(maxCredits).toLocaleString()} Credits Used` : 'Unlimited Credits'}
        </h2>
      </div>
      {!userSubscription &&
        <Button
          variant={'secondary'}
          className='my-3 w-full cursor-pointer hover:text-white font-semibold text-lg focus:bg-indigo-600 focus:text-white transition-all duration-200 hover:bg-indigo-500 py-6'
          onClick={() => router.push('/dashboard/billing')}
        >
          Upgrade
        </Button>
      }
    </div>
  )
}

export default UsageTrack