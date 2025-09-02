# Dashboard Home Components

This directory contains the modular components that make up the dashboard home page. The original monolithic `page.js` file has been broken down into smaller, focused components for better maintainability and reusability.

## Component Structure

### Core Components

- **`DashboardHeader`** - Header section with title, description, and action buttons (refresh, notifications, new campaign)
- **`ActivationBanner`** - Warning banner for inactive organizations with setup link
- **`ErrorDisplay`** - Error message display with dismiss functionality
- **`TimeFilter`** - Time period filter buttons (week/month/year)
- **`QuickStatsGrid`** - Grid of 4 metric cards showing key performance indicators
- **`RecentActivity`** - Recent donations and activity feed
- **`TopCampaigns`** - Top performing campaigns with progress bars
- **`OrganizationStatus`** - Organization health status and quick action links
- **`LoadingSkeleton`** - Comprehensive loading state for the entire dashboard

### Component Dependencies

Each component is self-contained and receives its data through props. The main `page.js` file orchestrates data fetching and state management, passing the necessary data down to each component.

### Props Interface

#### DashboardHeader
```jsx
<DashboardHeader 
   onRefresh={fetchDashboardData}
   loading={loading}
   showModal={showModal}
   setShowModal={setShowModal}
   organizationId={organizationId}
/>
```

#### ActivationBanner
```jsx
<ActivationBanner 
   organizationStatus={organizationStatus} 
   organizationId={organizationId} 
/>
```

#### ErrorDisplay
```jsx
<ErrorDisplay 
   error={error} 
   onDismiss={() => setError(null)} 
/>
```

#### TimeFilter
```jsx
<TimeFilter 
   active={active} 
   onFilterClick={handleFilterClick} 
/>
```

#### QuickStatsGrid
```jsx
<QuickStatsGrid 
   quickStats={quickStats} 
   loading={loading} 
/>
```

#### RecentActivity
```jsx
<RecentActivity 
   recentDonations={recentDonations}
   loading={loading}
   formatTimeAgo={formatTimeAgo}
/>
```

#### TopCampaigns
```jsx
<TopCampaigns 
   topCampaigns={topCampaigns}
   loading={loading}
   organizationId={organizationId}
/>
```

#### OrganizationStatus
```jsx
<OrganizationStatus 
   organizationStatus={organizationStatus}
   loading={loading}
   organizationId={organizationId}
/>
```

## Benefits of This Structure

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be reused in other parts of the application
3. **Testing** - Individual components can be tested in isolation
4. **Performance** - Components can be optimized independently
5. **Developer Experience** - Easier to understand and modify specific functionality

## Usage

Import components from the index file:

```jsx
import { 
   DashboardHeader,
   ActivationBanner,
   ErrorDisplay,
   TimeFilter,
   QuickStatsGrid,
   RecentActivity,
   TopCampaigns,
   OrganizationStatus,
   LoadingSkeleton
} from "./components"
```

## Loading States

Each component handles its own loading state internally, receiving a `loading` prop to determine when to show skeleton loaders vs. actual content.

## Error Handling

The `ErrorDisplay` component provides consistent error messaging across the dashboard, with the ability to dismiss errors and retry operations.
