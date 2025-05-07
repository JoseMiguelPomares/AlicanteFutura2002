import React, { createContext, useState, useEffect, useContext } from "react";
import { Producto } from "../components/ProductCard";
import { useAuth } from "./AuthContext";
import { FavoriteService } from "../services/favoriteService";

interface FavoritesContextType {
    favorites: Producto[];
    addFavorite: (product: Producto) => Promise<void>;
    removeFavorite: (productId: number) => Promise<void>;
    isFavorite: (productId: number) => boolean;
    getFavoritesCount: (productId: number) => number;
    refreshFavoritesCount: (productId: number) => Promise<void>;
    favoritesCount: Record<number, number>;
    loading: boolean;
}

interface FavoriteResponse {
    id: number;
    user: {
        id: number;
    };
    item: Producto;
}

interface FavoriteCountResponse {
    [itemId: number]: number;
}


const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const favoriteService = new FavoriteService();

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<Producto[]>([]);
    const [favoritesCount, setFavoritesCount] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);

    // Cargar favoritos de la API al iniciar o cuando cambia el usuario
    useEffect(() => {
        const loadFavorites = async () => {
            if (!isAuthenticated || !user?.id) {
                setFavorites([]);
                setFavoritesCount({});
                return;
            }

            try {
                setLoading(true);
                // Obtener favoritos del usuario
                const [userFavorites, counts] = await Promise.all([
                    favoriteService.getByUserId(user.id) as Promise<FavoriteResponse[]>,
                    favoriteService.getAllFavoritesCount() as Promise<FavoriteCountResponse>
                ]);
    
                const validFavorites = userFavorites.filter((fav): fav is FavoriteResponse => !!fav?.item?.id);
                setFavorites(validFavorites.map(fav => fav.item));
                setFavoritesCount(counts);
            } catch (error) {
                console.error("Error al cargar favoritos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, [user, isAuthenticated]);

    const addFavorite = async (product: Producto) => {
        // Solo permitir añadir favoritos si hay un usuario autenticado
        if (!isAuthenticated || !user?.id) return;

        try {
            setLoading(true);
            // Llamar a la API para añadir a favoritos
            await favoriteService.addFavorite(user.id, product.id);

            // Actualizar estado local
            setFavorites(prev => {
                if (!prev.some(p => p.id === product.id)) {
                    return [...prev, product];
                }
                return prev;
            });

            // Actualizar contador
            setFavoritesCount(prev => ({
                ...prev,
                [product.id]: (prev[product.id] || 0) + 1,
            }));

        } catch (error) {
            console.error("Error al añadir favorito:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId: number) => {
        if (!isAuthenticated || !user?.id) return;

        try {
            setLoading(true);
            // Llamar a la API para eliminar de favoritos
            await favoriteService.deleteFavorite(user.id, productId);

            // Actualizar estado local
            setFavorites(prev => prev.filter(p => p.id !== productId));

            // Actualizar contador
            const newCounts = { ...favoritesCount };
            if (newCounts[productId]) {
                newCounts[productId] = Math.max(0, newCounts[productId] - 1);
                setFavoritesCount(newCounts);
            }
        } catch (error) {
            console.error("Error al eliminar favorito:", error);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (productId: number) => {
        return favorites.some(p => p.id === productId);
    };

    const getFavoritesCount = (productId: number) => {
        return favoritesCount[productId] || 0;
    };

    const refreshFavoritesCount = async (productId: number) => {
        try {
            const count = await favoriteService.countFavoritesByItemId(productId) as number;
            setFavoritesCount(prev => ({ ...prev, [productId]: count }));
        } catch (error) {
            console.error(`Error refreshing count for item ${productId}:`, error);
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite,
                getFavoritesCount,
                refreshFavoritesCount,
                favoritesCount,
                loading
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites debe ser usado dentro de un FavoritesProvider");
    }
    return context;
};