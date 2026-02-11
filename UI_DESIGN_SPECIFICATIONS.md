# UI Design Specifications

This document outlines the design specifications for the Top Bar (Header) and Left Sidebar of the application, based on the current implementation in `AdminView.tsx`. Use these details to replicate the design on other platforms.

## 1. Top Bar (Header)

*   **Dimensions:**
    *   Height: `64px` (`h-16`)
    *   Width: `100%`
    *   Z-Index: `50` (Sticky top)

*   **Styling:**
    *   Background Color: `#003B46`
    *   Text Color: `White` (`#FFFFFF`)
    *   Shadow: Large Shadow (`shadow-lg`)
    *   Padding: `0 16px` (`px-4`) horizontal

*   **Layout:**
    *   Flexbox: `flex`, `justify-between`, `items-center`

### Elements

#### A. Left Section (Brand & Navigation)
1.  **Hamburger Menu Button:**
    *   Padding: `8px` (`p-2`)
    *   Color: `White`
    *   Hover Background: `#0E7490`
    *   Border Radius: `8px` (`rounded-lg`)
    *   Icon: `Menu` size `24px`

2.  **Logo Area:**
    *   **Logo Image:** Height `32px` (`h-8`), Object Fit `contain`
    *   **Divider:** Height `32px`, Width `1px`, Color `#6B7280` (`bg-gray-500`), Margin `0 8px` (`mx-2`)
    *   **Text Stack:**
        *   Canopy Name: "Pharmacy Cloud" -> Font Size `Default`, Weight `Secondary` (`font-semibold`), Leading `tight`
        *   Context Name: "Deliveries Hub" / "Admin Console" -> Font Size `14px` (`text-sm`), Color `#D1D5DB` (`text-gray-300`), Weight `Normal`

#### B. Right Section (User Actions)
1.  **Notification Bell:**
    *   Container Dimensions: `40px x 40px` (`w-10 h-10`)
    *   Background: `rgba(255, 255, 255, 0.1)` (`bg-white/10`)
    *   Border: `1px solid rgba(255, 255, 255, 0.2)` (`border-white/20`)
    *   Radius: `12px` (`rounded-xl`)
    *   Icon: `Bell` size `20px`
    *   Badge: `20px x 20px`, Background `#F43F5E` (`bg-rose-500`), Text White, Font Size `10px`, Bold, Absolute Position `top: -4px, right: -4px`.

2.  **User Profile Dropdown:**
    *   Height: `40px` (`h-10`)
    *   Background: `rgba(255, 255, 255, 0.1)` (`bg-white/10`)
    *   Border: `1px solid rgba(255, 255, 255, 0.2)`
    *   Radius: `9999px` (Full Pilled / `rounded-full`)
    *   Padding: `Left 4px`, `Right 16px` (`pl-1 pr-4`)
    *   **Avatar:** `32px x 32px`, Circle, Border `1px solid rgba(255, 255, 255, 0.5)`
    *   **Status Indicator:** `10px x 10px`, Background `#10B981` (`bg-emerald-500`), Border `2px solid #005961`.

3.  **Right Logo:**
    *   Container Height: `40px`
    *   Separator: Height `32px`, Width `2px`, Color `rgba(255, 255, 255, 0.2)`

---

## 2. Left Sidebar (Side Navigation)

*   **Dimensions:**
    *   Height: `100%` (Full Height)
    *   Width (Collapsed): `80px` (`w-20`)
    *   Width (Expanded): `256px` (`w-64`)
    *   Transition: `300ms` ease-in-out

*   **Styling:**
    *   Background Color: `#001a1d`
    *   Text Color: `White`

*   **Navigation Menu (Nav Container):**
    *   Margin Top: `32px` (`mt-8`)
    *   Padding: `0 16px` (`px-4`)

### Navigation Items (Buttons)

Each item in the sidebar follows these specs:

*   **Dimensions:**
    *   Width: `100%`
    *   Padding: `16px` vertical & horizontal (`px-4 py-4`)
    *   Border Radius: `16px` (`rounded-2xl`)

*   **Typography:**
    *   Font Size: `14px` (`text-sm`)
    *   Weight: `900` / Heavy (`font-black`)

*   **Icons:**
    *   Size: `20px`
    *   Flex Shrink: `0`

*   **States:**
    *   **Inactive (Default):**
        *   Text Color: `#64748B` (`text-slate-500`)
        *   Background: Transparent
        *   **Hover:** Text `White`, Background `#002f33`
    *   **Active (Selected):**
        *   Background Color: `#005961`
        *   Text Color: `White`
        *   Shadow: `0 20px 25px -5px rgba(0, 89, 97, 0.2)` (`shadow-xl shadow-[#005961]/20`)

---

## 3. Sub-Header (Breadcrumb Bar)

Located immediately below the Top Bar and to the right of the Sidebar.

*   **Styling:**
    *   Background: `rgba(255, 255, 255, 0.8)` with Backdrop Blur (`backdrop-blur-md`)
    *   Border Bottom: `1px solid #E2E8F0` (`border-slate-200`)
    *   Padding: `20px 40px` (`px-10 py-5`)

*   **Typography:**
    *   Font Size: `10px`
    *   Weight: `900` (`font-black`)
    *   Case: `Uppercase`
    *   Letter Spacing: `0.2em` (Extremely Wide)
    *   Colors:
        *   Label: `#CBD5E1` (`text-slate-300`)
        *   Active Page: `#005961`
