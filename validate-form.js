$(document).ready(function () {
    setMinimumDate();
    formatAgenciaContaOptions();

    //calls the function
    splitAgenciaConta();

    //event listener
    $('#agencia-conta-select').change(function () {
        splitAgenciaConta();
    });

    $('#tipoChavePix').on('change', function () {
        var tipoChave = $(this).val();
        var chavePix = $('#chavePix').val();
        if (tipoChave === 'CPF' || tipoChave === 'CNPJ') {
            var formattedChavePix = formatCPJ(chavePix, tipoChave);
            $('#chavePix').val(formattedChavePix);
        } else {
            $('#chavePix').val(chavePix);
        }
    });

    $('#chavePix').on('click', function () {
        $(this).prop('placeholder', '');
    });

    // Format input value on change and validate
    $('#chavePix').on('input', function () {
        var chavePix = $(this).val();
        var tipoChave = $('#tipoChavePix').val();
        if (tipoChave === 'CPF' || tipoChave === 'CNPJ') {
            var formattedChavePix = formatCPJ(chavePix, tipoChave);
            $(this).val(formattedChavePix);
            var isValid = false;
            if (tipoChave === 'CPF') {
                isValid = validateCPF(chavePix);
            } else if (tipoChave === 'CNPJ') {
                isValid = validateCNPJ(chavePix);
            }
            if (!isValid) {
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        } else {
            $(this).val(chavePix);
        }
    });
});



function setMinimumDate() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var yyyy = tomorrow.getFullYear();
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var minDate = yyyy + '-' + mm + '-' + dd;
    $('#data-pix').attr('min', minDate);
}

//split the input value in the formatted agencia and conta fields
function splitAgenciaConta() {
    var selectedOption = $('#agencia-conta-select option:selected').val();
    var agencia = selectedOption.substring(0, 4);
    var conta = selectedOption.substring(4);

    // Format the agencia field as "0000"
    var formattedAgencia = agencia.padStart(4, '0');

    // Format the conta field as "00.000000.0-0"
    var formattedConta = conta.replace(/(\d{2})(\d{6})(\d{1})/, '$1.$2-$3');

    // Update the agencia and conta fields with the formatted values
    $('#agencia-input').val(formattedAgencia);
    $('#conta-input').val(formattedConta);
}

//format the "option" display field of <select> agencia-conta
function formatAgenciaContaOptions() {
    var options = $('#agencia-conta-select option');
    options.each(function () {
        var value = $(this).val();
        var agencia = value.substring(0, 4);
        var conta = value.substring(4);
        var formattedConta = conta.replace(/(\d{2})(\d{6})(\d{1})/, '$1.$2-$3');
        var formattedValue = agencia + ' / ' + formattedConta;
        $(this).text(formattedValue);
    });
}

function formatCPJ(chavePix, tipoChave) {
    var formattedCPJ = chavePix.replace(/\D/g, '');
    if (tipoChave === 'CPF' && formattedCPJ.length === 11) {
        formattedCPJ = formattedCPJ.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (tipoChave === 'CNPJ' && formattedCPJ.length === 14) {
        formattedCPJ = formattedCPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return formattedCPJ;
}

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999") {
        return false;
    }
    var add = 0;
    for (var i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(9))) {
        return false;
    }
    add = 0;
    for (i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(10))) {
        return false;
    }
    return true;
}

function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 ||
        cnpj === "00000000000000" ||
        cnpj === "11111111111111" ||
        cnpj === "22222222222222" ||
        cnpj === "33333333333333" ||
        cnpj === "44444444444444" ||
        cnpj === "55555555555555" ||
        cnpj === "66666666666666" ||
        cnpj === "77777777777777" ||
        cnpj === "88888888888888" ||
        cnpj === "99999999999999") {
        return false;
    }
    var length = cnpj.length - 2;
    var numbers = cnpj.substring(0, length);
    var digits = cnpj.substring(length);
    var sum = 0;
    var pos = length - 7;
    for (var i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) {
        return false;
    }
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (var i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) {
        return false;
    }
    return true;
}
