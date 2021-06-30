import { useContext } from 'react'
import { StoresContext } from '../store'

export const useStores = () => useContext(StoresContext);