
import React from 'react'
import styles from './test.module.scss'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';


const Test = () => {
  const t = useTranslations('HomePage');
  return (
    <>
      <h1 className={`text-green-500 ${styles.title}`}>{t('title')}</h1>
      <Link href="/test">test</Link>
      <LanguageSwitcher />
    </>
  )
}

export default Test
