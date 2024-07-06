import { lazy } from "react";
import { Search, Listing, Profile, CreateListing, SignIn, SignUp } from "@pages"
const About = lazy(() => import("@pages/About"));
const UpdateListing = lazy(() => import("@pages/UpdateListing"));
import Home from "@pages/Home";

export const privateRoutes = [
    {
        path: '/create-listing',
        element: <CreateListing />
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/update-listing/:listingId',
        element: <UpdateListing />
    }
]

export const publicRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/sign-in',
        element: <SignIn />
    },
    {
        path: '/sign-up',
        element: <SignUp />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/search',
        element: <Search />
    },
    {
        path: '/listing/:listingId',
        element: <Listing />
    },
]