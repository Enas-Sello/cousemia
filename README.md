# Coursema - Medical Course Platform

## Overview

Coursema is a specialized online learning platform dedicated to providing high-quality medical courses for professionals, students, and enthusiasts in the medical field. Built with a modern frontend tech stack, Coursema offers a seamless user experience for managing and consuming medical course content. The platform supports multilingual content (English and Arabic), video-based lectures with thumbnail uploads, and categorized course structures for easy navigation.

### Features
- **Multilingual Support**: Courses available in English and Arabic.
- **Media Uploads**: Supports video lectures (up to 200MB) and thumbnail images (up to 2MB) with drag-and-drop functionality.
- **Course Categorization**: Organize courses by course, category, and subcategory using dynamic filters.
- **Responsive Design**: Optimized for various screen sizes with a dark theme (white text, gray borders, pink buttons).
- **Form Validation**: Robust validation using Valibot for lecture creation.
- **Loading States**: User-friendly loading indicators during uploads and submissions.

## Tech Stack

- **Frontend**: React, Next.js
- **Form Management**: React Hook Form with Valibot resolver
- **State Management**: React Query for data fetching and mutations
- **UI Components**: Material-UI (MUI) with custom styling
- **Notifications**: React Toastify for success/error messages
- **Styling**: Dark theme with white text, gray borders, and pink buttons

## Prerequisites

Before setting up the project, ensure you have the following installed:
- Node.js (v18.x or higher) - [Download](https://nodejs.org/)
- npm (v9.x or higher) or Yarn (v1.x or higher)
- Git - [Download](https://git-scm.com/)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Enas-Sello/cousemia.git
   cd coursema
   ```

2. **Install Dependencies**:
   Using npm:
   ```bash
   npm install
   ```
   Or using Yarn:
   ```bash
   yarn install
   ```

3. **Run the Development Server**:
   Using npm:
   ```bash
   npm run dev
   ```
   Or using Yarn:
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:3000`.

## Usage

### Adding a New Lecture
1. Open the "Add New Lecture" drawer from the dashboard.
2. Fill in the required fields:
   - English and Arabic titles and descriptions.
   - Select a video type ("Upload video" or "Insert a URL").
   - Upload a video (if "Upload video" is selected) or provide a URL.
   - Upload a thumbnail image.
   - Select course, category, and subcategory using the filter inputs.
   - Specify if the content is free.
3. Submit the form to create the lecture. A success message will appear via toast notification.

### Viewing Courses
- Navigate to the course list page to browse available medical courses.
- Filter courses by category and subcategory for targeted learning.

## Project Structure

```
coursema/
├── src/
│   ├── @core/
│   │   └── components/           # Reusable UI components (e.g., TextField, Autocomplete)
│   ├── @layouts/                 # Layout components for page structure
│   ├── @menu/                    # Menu-related components or utilities
│   ├── app/                      # Next.js app directory for routing and pages
│   ├── assets/                   # Static assets like images, fonts, etc.
│   ├── components/               # Application-specific components (e.g., MediaUploader, AddLectureDrawer)
│   ├── configs/                  # Configuration files for the application
│   ├── data/                     # API query functions (e.g., lecturesQuery, coursesQuery)
│   ├── hocs/                     # Higher-Order Components for reusable logic
│   ├── libs/                     # Utility libraries or helper functions
│   ├── providers/                # Context providers for state management
│   ├── schema/                   # Validation schemas (e.g., LectureFormSchema)
│   ├── types/                    # TypeScript type definitions (e.g., lectureType)
│   ├── utils/                    # Utility functions and helpers
│   ├── views/                    # View components for rendering UI sections
├── public/                       # Static assets (e.g., images)
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```

## Contributing

Contributions are welcome! To contribute to Coursema:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project’s coding standards and includes appropriate tests.

## Known Issues

- **Video Format Support**: Some video formats may not be supported in all browsers. A fallback message is displayed, but additional format support may be needed.
- **Accessibility**: While basic ARIA attributes are included, further accessibility testing with screen readers is recommended.

## Future Improvements

- **AI Integration**: Leverage AI to recommend courses based on user progress and interests (inspired by the developer’s AI diploma studies).
- **Advanced Filtering**: Implement more sophisticated filtering and search capabilities for courses.
- **Performance Optimization**: Optimize media uploads for faster performance.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact the project maintainer at:
- Email: enas.awad169@gmail.com
- GitHub: [Enas awad](https://github.com/Enas-Sello)

---

**Coursema** - Empowering Medical Education
