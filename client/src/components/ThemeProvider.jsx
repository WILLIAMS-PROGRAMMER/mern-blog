import { useSelector } from "react-redux"

export default function ThemeProvider({children}) { //children is the component that we will wrap with the theme provider
    const {theme} = useSelector((state) => state.theme) // this is for accessing the state of the store
    console.log(theme);
    return (
    <div className={theme}>
        <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
            {children
            // this is the component that we will wrap with the theme provider
            } 
        </div>
    </div>
  );
}
