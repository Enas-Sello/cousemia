'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import {
  IconHome,
  IconStack,
  IconBook,
  IconNotebook,
  IconBookmark,
  IconChartBar,
  IconDatabase,
  IconMap,
  IconMap2,
  IconHeartbeat,
  IconCurrencyDollar,
  IconDeviceDesktop,
  IconHelpCircle,
  IconFileText
} from '@tabler/icons-react'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import type { getDictionary } from '@/utils/getDictionary'
import CustomChip from '@/@core/components/mui/Chip'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>

  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const params = useParams()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<IconHome size={24} stroke={1.5} />}
          suffix={<CustomChip label='2' size='small' color='error' round='true' />}
        >
          {/* <MenuItem href={`/${locale}/dashboards`}>{dictionary['navigation'].eCommerce}</MenuItem> */}
          <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
        </SubMenu>
        <MenuSection label={dictionary['navigation'].appsPages}>
          <MenuItem href={`/${locale}/study/courses`} icon={<IconStack size={23} stroke={1} />}>
            Courses
          </MenuItem>
          <MenuItem href={`/${locale}/study/lectures`} icon={<IconBook size={23} stroke={1} />}>
            Lectures
          </MenuItem>

          <MenuItem href={`/${locale}/study/nots`} icon={<IconNotebook size={23} stroke={1} />}>
            Nots
          </MenuItem>
          <MenuItem href={`/${locale}/study/questionsAnswer`} icon={<IconBookmark size={23} stroke={1} />}>
            Questions & Answers
          </MenuItem>
          <MenuItem href={`/${locale}/study/flashCards`} icon={<IconChartBar size={23} stroke={1} />}>
            Flash Cards
          </MenuItem>
          <MenuItem href={`/${locale}/study/categories`} icon={<IconDatabase size={23} stroke={1} />}>
            Categories
          </MenuItem>
        </MenuSection>

        <MenuSection label='Users Management'>
          <MenuItem href={`/${locale}/users`} icon={<i className='tabler-users' />}>
            Users
          </MenuItem>
        </MenuSection>
        <MenuSection label='Utilities'>
          <MenuItem href={`/${locale}/utilitie/countries`} icon={<IconMap size={23} stroke={1} />}>
            Countries
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/hostCourse`} icon={<IconMap2 size={23} stroke={1} />}>
            Host Your Course
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/specialities`} icon={<IconHeartbeat size={23} stroke={1} />}>
            Specialties
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/events`} icon={<IconStack size={23} stroke={1} />}>
            Events
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/offers`} icon={<IconCurrencyDollar size={23} stroke={1} />}>
            Offers
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/config`} icon={<IconDeviceDesktop size={23} stroke={1} />}>
            Config
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/aboutUs`} icon={<IconHelpCircle size={23} stroke={1} />}>
            About Us
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/termsConditions`} icon={<IconFileText size={23} stroke={1} />}>
            Terms & Conditions
          </MenuItem>
          <MenuItem href={`/${locale}/utilitie/privacyPolicy`} icon={<IconFileText size={23} stroke={1} />}>
            Privacy Policy
          </MenuItem>
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
