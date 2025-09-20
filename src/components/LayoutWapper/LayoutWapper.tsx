import { initializeAxios } from "@/services"
import { useLocale } from "next-intl"
const LayoutWapper = ({children}: {children: React.ReactNode}) => {
    const locale = useLocale()
    initializeAxios({
        apiLocale: locale,
        xContent: 'desktop',
    })
  return (
    <>
        {children}
    </>
  )
}

export default LayoutWapper
