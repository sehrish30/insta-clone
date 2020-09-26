import  {useEffect, useState} from 'react'

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = evt => setMatches(evt.macthes);
  
      queryList.addListener(listener);
      return () => queryList.removeListener(listener);
    }, [query]);
    return matches;
  };


