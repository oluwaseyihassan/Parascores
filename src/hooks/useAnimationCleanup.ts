import { useState,useEffect } from "react";

const useAnimationCleanup = (state: boolean | undefined,duration: number) => {
    const [isVisible, setIsVisible] = useState(state);

    useEffect(() => {
      if (state) {
        setIsVisible(true);
      } else {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [state]);
  return (
    {isVisible, setIsVisible} as const
  )
}

export default useAnimationCleanup