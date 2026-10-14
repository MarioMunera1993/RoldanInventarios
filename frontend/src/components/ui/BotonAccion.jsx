export const BotonAccion = ({titulo}) => {
    return (
        <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
            {titulo}
        </button>
    )
}
