import React, { useState } from 'react';
    import '../styles/AdvancedFiltersModal.css';
    import { useDispatch, useSelector } from 'react-redux';
    import boardsSlice from '../redux/boardsSlice';

    export default function AdvancedFiltersModal({ setIsAdvancedFiltersOpen }) {
      const dispatch = useDispatch();
      const [priorityFilter, setPriorityFilter] = useState(useSelector((state) => state.boards.priorityFilter) || null);
      const [statusFilter, setStatusFilter] = useState(useSelector((state) => state.boards.statusFilter) || null);
      const [projectFilter, setProjectFilter] = useState(useSelector((state) => state.boards.projectFilter) || null);
      const [categoryFilter, setCategoryFilter] = useState(useSelector((state) => state.boards.categoryFilter) || null);
      const projects = ["Projet 1", "Projet 2", "Projet 3"];
      const categories = ["Catégorie 1", "Catégorie 2", "Catégorie 3"];

      const handlePriorityChange = (e) => {
        setPriorityFilter(e.target.value === "" ? null : e.target.value);
      };

      const handleStatusChange = (e) => {
        setStatusFilter(e.target.value === "" ? null : e.target.value);
      };

      const handleProjectChange = (e) => {
        setProjectFilter(e.target.value === "" ? null : e.target.value);
      };

      const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value === "" ? null : e.target.value);
      };

      const handleApplyFilters = () => {
        dispatch(boardsSlice.actions.setPriorityFilter(priorityFilter));
        dispatch(boardsSlice.actions.setStatusFilter(statusFilter));
        dispatch(boardsSlice.actions.setProjectFilter(projectFilter));
        dispatch(boardsSlice.actions.setCategoryFilter(categoryFilter));
        setIsAdvancedFiltersOpen(false);
      };

      const handleResetFilters = () => {
        setPriorityFilter(null);
        setStatusFilter(null);
        setProjectFilter(null);
        setCategoryFilter(null);
        dispatch(boardsSlice.actions.setPriorityFilter(null));
        dispatch(boardsSlice.actions.setStatusFilter(null));
        dispatch(boardsSlice.actions.setProjectFilter(null));
        dispatch(boardsSlice.actions.setCategoryFilter(null));
      };

      return (
        <div className="modal-container dimmed" onClick={(e) => { if (e.target === e.currentTarget) setIsAdvancedFiltersOpen(false)}}>
          <div className="modal advanced-filters-modal">
            <h3>Filtres avancés</h3>
            <div className="filter-group">
              <label>Priorité</label>
              <select value={priorityFilter || ""} onChange={handlePriorityChange} className="select-status text-L">
                <option value="">Toutes</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Statut</label>
              <select value={statusFilter || ""} onChange={handleStatusChange} className="select-status text-L">
                <option value="">Tous</option>
                <option value="Todo">À faire</option>
                <option value="Doing">En cours</option>
                <option value="Done">Terminé</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Projet</label>
              <select value={projectFilter || ""} onChange={handleProjectChange} className="select-status text-L">
                <option value="">Tous</option>
                {projects.map((proj, index) => (
                  <option key={index} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Catégorie</label>
              <select value={categoryFilter || ""} onChange={handleCategoryChange} className="select-status text-L">
                <option value="">Toutes</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-buttons">
              <button onClick={handleApplyFilters} className="create-btn">Appliquer</button>
              <button onClick={handleResetFilters} className="btn cancel-btn">Réinitialiser</button>
            </div>
          </div>
        </div>
      );
    }
