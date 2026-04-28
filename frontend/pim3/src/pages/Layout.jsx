import React from 'react'
import { Header } from '../components/header/Header'
import { Outlet } from 'react-router'

export function Layout() {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}