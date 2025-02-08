const SummaryRendicion = ({ totalRendicion, formatCLP, asignacion, items }) => {
    // Si no hay items, no renderizar el componente
    if (!items || items.length === 0) {
      return null;
    }
  
    return (
      <div className=" mx-auto p- sm:p-">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4 sm:space-y-6 p-6">
            {/* Total Rendición */}
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-500">Total Rendición</span>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                {formatCLP(totalRendicion)}
              </p>
            </div>
  
            {/* Saldo Actual */}
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-500">Saldo Actual</span>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                {formatCLP(asignacion.saldo_recibido)}
              </p>
            </div>
  
            {/* Saldo Final */}
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
              <span className="text-base sm:text-lg font-medium text-gray-700">Saldo Final</span>
              <p className="text-base sm:text-lg font-semibold text-red-700">
                {formatCLP(asignacion.saldo_recibido - totalRendicion)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SummaryRendicion;