import React, { useEffect } from 'react'

export function CustomFooter(bodyClass) {
  useEffect(()=>{
    document.body.classList.add(bodyClass);
    return () => document.body.classList.remove(bodyClass)
  },[bodyClass])
}

