// To-Do List Application with Local Storage

class TodoApp {
  constructor() {
    this.todos = this.loadTodos();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.render();
  }

  cacheElements() {
    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.taskCount = document.getElementById('taskCount');
    this.clearBtn = document.getElementById('clearBtn');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  attachEventListeners() {
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });
    this.clearBtn.addEventListener('click', () => this.clearCompleted());
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
    });
  }

  loadTodos() {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  addTodo() {
    const text = this.todoInput.value.trim();
    if (!text) {
      alert('Please enter a task.');
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      created: new Date().toISOString()
    };

    this.todos.unshift(todo);
    this.saveTodos();
    this.todoInput.value = '';
    this.todoInput.focus();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.render();
  }

  clearCompleted() {
    const completedCount = this.todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      alert('No completed tasks to clear.');
      return;
    }
    if (confirm(`Clear ${completedCount} completed task(s)?`)) {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveTodos();
      this.render();
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  render() {
    const filtered = this.getFilteredTodos();
    const active = this.todos.filter(t => !t.completed).length;

    this.taskCount.textContent = `${active} ${active === 1 ? 'task' : 'tasks'} remaining`;

    if (this.todos.length === 0) {
      this.todoList.innerHTML = `
        <div class="empty">
          <div class="glyph">✓</div>
          <p>No tasks yet. Add one to get started!</p>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      this.todoList.innerHTML = `
        <div class="empty">
          <div class="glyph">✓</div>
          <p>No ${this.currentFilter} tasks.</p>
        </div>
      `;
      return;
    }

    this.todoList.innerHTML = filtered.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <div class="todo-checkbox">
          <input 
            type="checkbox" 
            ${todo.completed ? 'checked' : ''}
            data-id="${todo.id}"
            class="checkbox-input"
          >
          <span class="checkmark"></span>
        </div>
        <div class="todo-content">
          <div class="todo-text">${this.escapeHtml(todo.text)}</div>
          <div class="todo-meta">${this.formatDate(todo.created)}</div>
        </div>
        <button class="btn-delete" data-id="${todo.id}" title="Delete task">×</button>
      </div>
    `).join('');

    // Attach event listeners to checkboxes and delete buttons
    this.todoList.querySelectorAll('.checkbox-input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => this.toggleTodo(parseInt(e.target.dataset.id)));
    });

    this.todoList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteTodo(parseInt(e.target.dataset.id)));
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});