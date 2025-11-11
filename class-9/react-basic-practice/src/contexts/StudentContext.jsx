import { createContext, useState } from "react";

const StudentContext = createContext({
    result: 'A+',
    setResult: () => {},
})

export const StudentContextProvider = ({children}) => {
    const [result, setResult] = useState('A+');

    const value = {
        result,
        setResult,
    }

    return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}


export default StudentContext
