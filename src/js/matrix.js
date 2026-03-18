const MAX_MATRIX_SIZE = 10;
const MATRIX_INPUT_PREFIX = 'matrixInput';

const elements = {
    matrixSize: document.getElementById('matrixSize'),
    createInputsButton: document.getElementById('createInputsButton'),
    inputContainer: document.getElementById('inputContainer'),
    calculateButton: document.getElementById('calculateButton'),
    result: document.getElementById('result'),
    matrixContainer: document.getElementById('matrixContainer'),
};

function buildMatrixInputId(rowIndex, columnIndex) {
    return `${MATRIX_INPUT_PREFIX}_${rowIndex}_${columnIndex}`;
}

function getMatrixSize() {
    return parseInt(elements.matrixSize.value);
}

function createMatrixRow() {
    const rowContainer = document.createElement('div');
    rowContainer.className = 'matrix-row';
    return rowContainer;
}

function focusMatrixInput(rowIndex, columnIndex) {
    const nextInput = document.getElementById(buildMatrixInputId(rowIndex, columnIndex));
    if (nextInput) {
        nextInput.focus();
    }
}

function handleMatrixInputKeydown(rowIndex, columnIndex, size) {
    return function onMatrixInputKeydown(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusMatrixInput(Math.min(rowIndex + 1, size - 1), columnIndex);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusMatrixInput(Math.max(rowIndex - 1, 0), columnIndex);
            return;
        }

        if (event.key === 'ArrowRight' && event.target.selectionStart === event.target.value.length) {
            event.preventDefault();
            focusMatrixInput(rowIndex, Math.min(columnIndex + 1, size - 1));
            return;
        }

        if (event.key === 'ArrowLeft' && event.target.selectionStart === 0) {
            event.preventDefault();
            focusMatrixInput(rowIndex, Math.max(columnIndex - 1, 0));
        }
    };
}

function createEditableMatrixInput(rowIndex, columnIndex, size) {
    const input = document.createElement('input');
    input.id = buildMatrixInputId(rowIndex, columnIndex);
    input.type = 'text';
    input.size = 10;
    input.placeholder = `Cell ${rowIndex}, ${columnIndex}`;
    input.addEventListener('keydown', handleMatrixInputKeydown(rowIndex, columnIndex, size));
    return input;
}

function createReadonlyMatrixInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.size = 10;
    input.value = value;
    input.readOnly = true;
    return input;
}

function renderInputMatrix(size) {
    elements.inputContainer.innerHTML = '';

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
        const rowContainer = createMatrixRow();

        for (let columnIndex = 0; columnIndex < size; columnIndex++) {
            rowContainer.appendChild(createEditableMatrixInput(rowIndex, columnIndex, size));
        }

        elements.inputContainer.appendChild(rowContainer);
    }
}

function fillMatrixFromInputs(matrix, size) {
    let rowIndex = 0;
    let columnIndex = 0;

    try {
        for (rowIndex = 0; rowIndex < size; rowIndex++) {
            for (columnIndex = 0; columnIndex < size; columnIndex++) {
                const input = document.getElementById(buildMatrixInputId(rowIndex, columnIndex));
                const value = Module.stringToComplex(input.value);
                matrix.set(rowIndex, columnIndex, value);
            }
        }
    } catch (error) {
        alert(`Cell (${rowIndex}, ${columnIndex}) の入力値が正しくありません。`);
    }
}

function renderInverseMatrix(inverseMatrix, size) {
    if (inverseMatrix.Height() != 0) {
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            const rowContainer = createMatrixRow();

            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                const value = Module.complexToString(inverseMatrix.get(rowIndex, columnIndex));
                rowContainer.appendChild(createReadonlyMatrixInput(value));
            }

            elements.matrixContainer.appendChild(rowContainer);
        }
    }
}

elements.createInputsButton.addEventListener('click', function onCreateInputsButtonClick() {
    const size = getMatrixSize();

    if (size !== size || size > MAX_MATRIX_SIZE) {
        alert('Please provide a square matrix with size up to 10x10.');
        return;
    }

    renderInputMatrix(size);
});

elements.calculateButton.addEventListener('click', function onCalculateButtonClick() {
    const size = getMatrixSize();
    elements.matrixContainer.innerHTML = '';

    const matrix = new Module.Matrix(size, size);
    fillMatrixFromInputs(matrix, size);

    const result = matrix.determinant();
    elements.result.textContent = `Determinant: ${Module.complexToString(result)}`;

    const inverseMatrix = matrix.inverse();
    renderInverseMatrix(inverseMatrix, size);

    matrix.delete();
});

