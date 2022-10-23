var url =
    'https://filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D'

$(document).ready(function() {
    $.get(url, function(data, status) {
        for (let i = 0; i < data.length; i++) {
            getData(data[i]);
        }
    });

    let getData = (data) => {
        // let row = $('<tr class="data-row"></tr>')
        let row = $(
            ` 
              <tr class="data-row">
                <td class="column1">` +
            data.id +
            `</td>
                <td class="column2">` +
            data.firstName +
            `</td>
                <td class="column3">` +
            data.lastName +
            `</td>
                <td class="column4">` +
            data.email +
            `</td>
                <td class="column5">` +
            data.phone +
            `</td>
              </tr>
              `
        );

        $("#table-body").append(row);




        row.click(function() {
            details(data);
            $(".data-row").removeClass("active");
            row.addClass("active");
        });
    };



    //display the content of clicked row
    let details = (data) => {
        const { firstName, lastName, address, description } = data;
        const { streetAddress, city, state, zip } = address;
        $("#info-content").html(
            `<div><b>User selected:</b> ${firstName} ${lastName}</div>
                  <div>
                      <b>Description: </b>
                      <textarea cols="50" rows="5" readonly>
                          ${description}
                      </textarea>
                  </div>
                  <div><b>Address:</b> ${streetAddress} </div>
                  <div><b>City:</b> ${city} </div>
                  <div><b>State:</b> ${state} </div>
                  <div><b>Zip:</b> ${zip} </div>
              </div>`
        );
    };



    //to search an item
    $("#search-box").on("keyup", function() {
        var value = $(this).val().toLowerCase();

        $("#table-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

    });

})






//highlight

$(function() {
    $('#search-box').bind('keyup change', function(ev) {
        // pull in the new value
        var searchTerm = $(this).val();

        // remove any old highlighted terms
        $('#table-body').removeHighlight();

        // disable highlighting if empty
        if (searchTerm) {
            // highlight the new term
            $('#search-box').highlight(searchTerm);
            $('#table-body').highlight(searchTerm);
        }
    });
});


jQuery.fn.highlight = function(pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        } else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.each(function() {
        innerHighlight(this, pat.toUpperCase());
    });
};

jQuery.fn.removeHighlight = function() {
    function newNormalize(node) {
        for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
                newNormalize(child);
                continue;
            }
            if (child.nodeType != 3) { continue; }
            var next = child.nextSibling;
            if (next == null || next.nodeType != 3) { continue; }
            var combined_text = child.nodeValue + next.nodeValue;
            new_node = node.ownerDocument.createTextNode(combined_text);
            node.insertBefore(new_node, child);
            node.removeChild(child);
            node.removeChild(next);
            i--;
            nodeCount--;
        }
    }

    return this.find("span.highlight").each(function() {
        var thisParent = this.parentNode;
        thisParent.replaceChild(this.firstChild, this);
        newNormalize(thisParent);
    }).end();
};