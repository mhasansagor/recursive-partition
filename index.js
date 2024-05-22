document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    container.style.backgroundColor = getRandomColor();

    container.querySelector('.v').addEventListener('click', () => split(container, 'vertical'));
    container.querySelector('.h').addEventListener('click', () => split(container, 'horizontal'));
    container.querySelector('.remove').addEventListener('click', () => remove(container));
    // if(container!=1){
    // }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function split(partition, direction) {
        if (partition.children.length > 1) return;

        const newPartition = document.createElement('div');
        newPartition.classList.add('partition');
        newPartition.style.backgroundColor = getRandomColor();

        const controls = document.createElement('div');
        controls.classList.add('controls');
        controls.innerHTML = `
            <button class="v">V</button>
            <button class="h">H</button>
            <button class="remove">-</button>
        `;

        newPartition.appendChild(controls);
        controls.querySelector('.v').addEventListener('click', () => split(newPartition, 'vertical'));
        controls.querySelector('.h').addEventListener('click', () => split(newPartition, 'horizontal'));
        controls.querySelector('.remove').addEventListener('click', () => remove(newPartition));

        const existingPartition = partition.cloneNode(true);
        existingPartition.style.flex = '1';
        existingPartition.querySelector('.v').addEventListener('click', () => split(existingPartition, 'vertical'));
        existingPartition.querySelector('.h').addEventListener('click', () => split(existingPartition, 'horizontal'));

        while (partition.firstChild) {
            partition.removeChild(partition.firstChild);
        }

        partition.appendChild(existingPartition);
        partition.appendChild(newPartition);

        if (direction === 'vertical') {
            partition.classList.add('split-vertical');
            partition.classList.remove('split-horizontal');
        } else {
            partition.classList.add('split-horizontal');
            partition.classList.remove('split-vertical');
        }

        partition.appendChild(createResizeHandle(direction));
    }

    function createResizeHandle(direction) {
        const handle = document.createElement('div');
        handle.classList.add('partition-resize-handle', direction);

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const parent = handle.parentElement;
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parent.offsetWidth;
            const startHeight = parent.offsetHeight;

            const mouseMoveHandler = (event) => {
                if (direction === 'vertical') {
                    const newWidth = startWidth + (event.clientX - startX);
                    const percentage = (newWidth / parent.parentElement.offsetWidth) * 100;
                    parent.style.flexBasis = `${percentage}%`;
                } else {
                    const newHeight = startHeight + (event.clientY - startY);
                    const percentage = (newHeight / parent.parentElement.offsetHeight) * 100;
                    parent.style.flexBasis = `${percentage}%`;
                }
            };

            const mouseUpHandler = () => {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        return handle;
    }

    function remove(partition) {
        if (partition === container) return;
        const parent = partition.parentElement;
        if (parent.children.length === 2) {
            const sibling = partition.nextElementSibling || partition.previousElementSibling;
            parent.innerHTML = '';
            parent.appendChild(sibling);
            parent.classList.remove('split-vertical', 'split-horizontal');
        } else {
            partition.remove();
        }
    }
});
