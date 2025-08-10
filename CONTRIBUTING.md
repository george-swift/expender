# Contributing to Expender Frontend

Thank you for considering contributing to the Expender frontend! This guide will help you understand the development workflow, coding standards, and contribution process specifically for the web application.

## Table of Contents

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Question or Problem?](#question-or-problem)
- [Issues and Bugs](#issues-and-bugs)
- [Feature Requests](#feature-requests)
- [Development Setup](#development-setup)
- [Code Style and Standards](#code-style-and-standards)
- [Component Development](#component-development)
- [Testing](#testing)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Additional Resources](#additional-resources)

## Code of Conduct

Help keep Expender open and inclusive. Please read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Question or Problem?

If you have a question or are experiencing a problem with the frontend, please use the structured issue templates:

### 📋 Issue Templates Available

- **🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)**: For UI bugs, component issues, or unexpected behavior
- **✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)**: For new features or UI enhancements
- **🎨 [Design/UI Issue](.github/ISSUE_TEMPLATE/design_issue.yml)**: For design inconsistencies or UX improvements
- **♿ [Accessibility Issue](.github/ISSUE_TEMPLATE/accessibility_issue.yml)**: For accessibility compliance or screen reader issues
- **📱 [Mobile/Responsive Issue](.github/ISSUE_TEMPLATE/mobile_issue.yml)**: For mobile responsiveness or cross-device compatibility
- **⚡ [Performance Issue](.github/ISSUE_TEMPLATE/performance_issue.yml)**: For loading times, bundle size, or runtime performance
- **❓ [Question/Documentation](.github/ISSUE_TEMPLATE/question.yml)**: For usage questions or documentation improvements

### 🔍 Before Creating an Issue

1. **Search Existing Issues**: Check if your issue has already been reported
2. **Check Documentation**: Review the README.md and component documentation
3. **Test in Different Browsers**: Verify the issue occurs across browsers
4. **Check Console**: Look for JavaScript errors or warnings
5. **Provide Screenshots**: Visual issues benefit from screenshots or screen recordings

## Issues and Bugs

### 🐛 Bug Reporting Process

When reporting bugs, please include:

- **Environment Information**: Browser, OS, screen size, device type
- **Reproduction Steps**: Clear, step-by-step instructions
- **Expected vs Actual Behavior**: What should happen vs what actually happens
- **Screenshots/Videos**: Visual evidence of the issue
- **Console Errors**: Any JavaScript errors or warnings
- **Network Issues**: Failed API calls or loading problems

### 🎯 Priority Levels

- **Critical**: App crashes, data loss, security vulnerabilities
- **High**: Core features broken, major UX issues, accessibility violations
- **Medium**: Minor feature issues, design inconsistencies
- **Low**: Enhancement requests, documentation improvements

## Feature Requests

### ✨ Feature Request Categories

- **🎨 UI/UX**: Interface improvements, design enhancements, user experience
- **📱 Mobile**: Mobile-specific features and responsive improvements
- **♿ Accessibility**: WCAG compliance and inclusive design features
- **⚡ Performance**: Speed optimizations, bundle size reductions
- **🔧 Developer Experience**: Development tools, debugging features
- **🧩 Components**: New reusable components or component improvements
- **📊 Analytics**: User tracking, metrics, and data visualization

### 📊 Evaluation Criteria

Features are evaluated based on:

- **User Impact**: How many users benefit and improvement to user experience
- **Design Consistency**: Alignment with existing design system and patterns
- **Technical Feasibility**: Implementation complexity and maintenance overhead
- **Accessibility**: Impact on inclusive design and WCAG compliance
- **Performance Impact**: Effect on bundle size, loading times, and runtime performance

## Development Setup

### Prerequisites

- **Node.js 18.17+**: Required for Next.js and build tools
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Git**: Version control

### Local Development Environment

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/george-swift/expender.git
   cd expender
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**

   ```bash
   pnpm dev
   ```

5. **Verify Setup**

   Open [http://localhost:3000](http://localhost:3000) and verify the application loads correctly.

### Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow established code patterns
   - Add types for new interfaces
   - Update documentation as needed
   - Test across different screen sizes

3. **Test Your Changes**

   ```bash
   # Lint code
   pnpm lint

   # Type check
   npx tsc --noEmit

   # Build to verify production compatibility
   pnpm build
   ```

4. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

## Code Style and Standards

### TypeScript Standards

- **Strict Type Checking**: Enable strict mode and avoid `any` types
- **Interface Definitions**: Define interfaces for props, API responses, and complex objects
- **Type Imports**: Use `import type` for type-only imports
- **Generic Types**: Use generics for reusable components and utilities

```typescript
// Good
interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: ExpenseFormData) => Promise<void>
  disabled?: boolean
}

// Avoid
const ExpenseForm = (props: any) => {
  // Implementation
}
```

### React Standards

- **Functional Components**: Use function components with hooks
- **Component Naming**: PascalCase for components, camelCase for functions
- **Props Destructuring**: Destructure props in function parameters
- **Default Props**: Use default parameters instead of defaultProps

```typescript
// Good
export function ExpenseCard({
  expense,
  onEdit,
  showActions = true
}: ExpenseCardProps) {
  // Implementation
}

// Avoid
export const ExpenseCard = props => {
  const { expense, onEdit } = props
  // Implementation
}
```

### CSS and Styling

- **Tailwind CSS**: Use utility classes for styling
- **CSS Variables**: Use CSS custom properties for theme values
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Dark Mode**: Support both light and dark themes

```typescript
// Good
<div className="flex flex-col gap-4 p-6 bg-card text-card-foreground rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold tracking-tight">Expense Details</h2>
</div>

// Avoid inline styles when Tailwind utilities exist
<div style={{ padding: '24px', backgroundColor: 'white' }}>
```

### File and Directory Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components (Button, Input, etc.)
│   ├── expense-form.tsx    # Feature-specific components
│   └── dashboard-*.tsx     # Related components grouped by prefix
├── lib/
│   ├── utils.ts           # General utilities
│   ├── api/               # API client configuration
│   └── validations/       # Zod schemas
├── hooks/
│   ├── use-expenses.ts    # Data aggregation hook
│   └── use-dialog.ts      # UI state hooks
└── types/
    ├── expense.ts         # Domain types
    └── api.ts             # API response types
```

## Component Development

### Component Patterns

1. **Base Components**: Located in `components/ui/`, built with shadcn and Radix UI primitives
2. **Feature Components**: Business logic components that use base components
3. **Layout Components**: Page layouts and navigation components
4. **Form Components**: Form handling with React Hook Form and Zod validation

### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Composable**: Design components to work well together
- **Accessible**: Include proper ARIA attributes and keyboard navigation
- **Performant**: Use React.memo, useMemo, and useCallback appropriately

```typescript
// Example component structure
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### State Management

- **Local State**: useState for simple component state
- **Shared State**: Context API for cross-component state
- **URL State**: `nuqs` for shareable application state

## Testing

### Testing Strategy

1. **Unit Tests**: Test utility functions and isolated component logic
2. **Integration Tests**: Test component interactions and user workflows
3. **Accessibility Tests**: Automated accessibility testing
4. **Visual Regression**: Screenshot testing for UI consistency

### Testing Tools (TBA)

### Writing Tests (TBA)

## Accessibility Guidelines

### WCAG 2.1 Compliance

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader Support**: Proper semantic HTML and ARIA attributes
- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text
- **Focus Management**: Visible focus indicators and logical tab order

### Implementation Checklist

- [ ] Use semantic HTML elements (`button`, `nav`, `main`, `article`)
- [ ] Include alt text for images
- [ ] Ensure keyboard navigation works for all interactive elements
- [ ] Test with screen reader software
- [ ] Verify color contrast meets WCAG standards
- [ ] Include skip links for keyboard users

## Performance Guidelines

### Optimization Strategies

1. **Code Splitting**: Dynamic imports for large components
2. **Image Optimization**: Next.js Image component with proper sizing
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Runtime Performance**: Efficient re-renders and memory usage

### Performance Checklist

- [ ] Use Next.js Image component for images
- [ ] Implement lazy loading for below-the-fold content
- [ ] Optimize bundle size with dynamic imports
- [ ] Monitor Core Web Vitals metrics
- [ ] Use React.memo for expensive components
- [ ] Implement proper loading states

```typescript
// Performance optimization example
import { memo, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import for large component
const ExpenseChart = dynamic(() => import('./expense-chart'), {
  loading: () => <ChartSkeleton />
})

// Memoized component
export const ExpenseList = memo(({ expenses }: ExpenseListProps) => {
  const sortedExpenses = useMemo(
    () => expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenses]
  )

  return (
    <div>
      {sortedExpenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  )
})
```

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
feat: add expense filtering by category
fix: resolve mobile navigation menu overlap
style: update button hover states for consistency
docs: add component usage examples
refactor: extract expense validation logic
test: add unit tests for expense form validation
chore: update dependencies to latest versions
```

## Pull Request Process

### Before Submitting

1. **Test Thoroughly**: Verify changes work across browsers and screen sizes
2. **Check Accessibility**: Run accessibility audits and manual testing
3. **Performance Review**: Ensure changes don't negatively impact performance
4. **Documentation**: Update README or component docs if needed

### Pull Request Template

Our PR template includes:

- **📋 Summary & Type of Change**: Clear description and categorization
- **🧪 Testing**: Comprehensive testing checklist
- **📱 Mobile Testing**: Mobile responsiveness verification
- **♿ Accessibility**: Accessibility compliance checklist
- **⚡ Performance**: Performance impact assessment
- **🎨 Design Review**: UI/UX consistency check

### Review Process

1. **Automated Checks**: All CI workflows must pass
2. **Code Review**: At least one approved review required
3. **Design Review**: UI changes require design team review
4. **Accessibility Review**: Accessibility-sensitive changes need specialized review
5. **Performance Review**: Performance-critical changes require metrics validation

### Review Criteria

**Code Quality:**

- TypeScript compliance and type safety
- Component patterns and reusability
- Error handling and user feedback
- Code documentation and comments

**UI/UX:**

- Design system consistency
- Responsive design implementation
- User experience and usability
- Loading states and error states

**Performance:**

- Bundle size impact
- Runtime performance
- Core Web Vitals metrics
- Loading performance

## Additional Resources

### Documentation & Learning

- **[Next.js Documentation](https://nextjs.org/docs)**: Framework features and API
- **[React Documentation](https://react.dev/)**: React concepts and patterns
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**: Utility classes and customization
- **[Radix UI Documentation](https://www.radix-ui.com/)**: Accessible component primitives
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**: TypeScript best practices

### Design System

- **[Design Tokens](./src/styles/)**: Color palette, spacing, typography
- **[Component Library](./src/components/ui/)**: Base components and variants
- **[Icon System](https://lucide.dev/)**: Icon usage and customization
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**: WCAG 2.1 quick reference

### Getting Help

- **🐛 Bug Reports**: Use our [issue templates](.github/ISSUE_TEMPLATE/)
- **💬 Discussions**: [GitHub Discussions](../../discussions) for questions
- **📧 Contact**: [support@expender.app](mailto:support@expender.app) for development questions

### Community Guidelines

- **📜 [Code of Conduct](CODE_OF_CONDUCT.md)**: Community standards and expectations
- **🎯 [Issue Templates](.github/ISSUE_TEMPLATE/)**: Structured reporting for different issue types
- **🤝 [Pull Request Template](.github/pull_request_template.md)**: Comprehensive PR checklist

---

Thank you for contributing to Expender! Your efforts help make expense management easier and more accessible for everyone. 🙏
