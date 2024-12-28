"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageReady = pageReady;
exports.DatatableFilter = exports.DatePicker = exports.Select = exports.DataTable = exports.Tab = exports.Drawer = exports.Modal = exports.Popover = exports.Button = exports.PageLoader = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

var PageLoader = {
  progress: 0,
  // To keep track of current progress
  init: function init() {
    var progressBar = document.querySelector('.gts-progress-bar');

    if (progressBar) {
      // Initially start at 0%
      PageLoader.updateProgress(0); // Gradually increase progress until the DOM is ready

      var slowLoading = setInterval(function () {
        if (PageLoader.progress < 80) {
          PageLoader.updateProgress(PageLoader.progress + 1); // Increase slowly
        }
      }, 100); // Adjust the speed of the increase (100ms)
      // Track when the DOM is interactive (50%)

      document.onreadystatechange = function () {
        if (document.readyState === 'interactive') {
          clearInterval(slowLoading); // Stop the slow loading process

          PageLoader.slowIncreaseTo(90); // Slow increase to 90%
        } else if (document.readyState === 'complete') {
          PageLoader.slowIncreaseTo(100); // Finish loading (100%)
          // Hide the loader after a short delay

          setTimeout(function () {
            document.body.classList.add('loaded');
          }, 1400); // 1400ms delay before hiding
        }
      }; // Track full page load (assets like images are loaded)
      // window.addEventListener('load', () => {
      //    // Final increase to 100% when fully loaded
      // });

    }
  },
  // Function to update progress bar width
  updateProgress: function updateProgress(percent) {
    PageLoader.progress = percent;
    var progressBar = document.querySelector('.gts-progress-bar');
    if (progressBar) progressBar.style.width = "".concat(percent, "%");
  },
  // Gradually increase the progress bar to a target value
  slowIncreaseTo: function slowIncreaseTo(target) {
    var incrementSpeed = 20; // How long each step takes (in ms)

    var interval = setInterval(function () {
      if (PageLoader.progress < target) {
        PageLoader.updateProgress(PageLoader.progress + 1); // Increment by 1% at a time
      } else {
        clearInterval(interval); // Stop when target is reached
      }
    }, incrementSpeed);
  }
};
exports.PageLoader = PageLoader;
var Button = {
  init: function init() {
    var buttonsNodeList = document.querySelectorAll(".btn");

    if (buttonsNodeList.length) {
      Button.rippleEffectMovement();
    }
  },
  rippleEffectMovement: function rippleEffectMovement() {
    var buttonsNodeList = document.querySelectorAll(".btn");
    buttonsNodeList.forEach(function (btn) {
      // Hover event
      btn.addEventListener("mouseenter", Button.createRipple); // Click event

      btn.addEventListener("click", Button.createRipple);
    });
  },
  createRipple: function createRipple(e) {
    var target = e.target; // The button element

    var x = e.clientX - target.getBoundingClientRect().left;
    var y = e.clientY - target.getBoundingClientRect().top;
    var rEffect = document.createElement("span");
    rEffect.style.left = "".concat(x, "px");
    rEffect.style.top = "".concat(y, "px");
    rEffect.classList.add("ripple"); // Add a class to the span for styling

    target.appendChild(rEffect);
    setTimeout(function () {
      rEffect.remove(); // Remove the ripple after the animation
    }, 850);
  }
};
exports.Button = Button;
var Popover = {
  init: function init() {
    var popoverNodeList = document.querySelectorAll(".popover-wrapper");

    if (popoverNodeList.length) {
      Popover.openPopover();
      Popover.closePopover();
    }
  },
  // Set the width of the popover to match the target element's width
  setWidth: function setWidth(targetElement, popoverBody) {
    var updatePopoverWidth = function updatePopoverWidth() {
      var targetRect = targetElement.getBoundingClientRect();
      popoverBody.style.width = "".concat(targetRect.width - 20, "px"); // Offset of 10px
    }; // Set the initial width when the popover is created


    updatePopoverWidth(); // Adjust the width on window resize

    window.addEventListener("resize", updatePopoverWidth);
  },
  setPosition: function setPosition(targetElement, popoverBody) {
    var updatePopoverPosition = function updatePopoverPosition() {
      var targetRect = targetElement.getBoundingClientRect(); // Target element dimensions

      var popoverRect = popoverBody.getBoundingClientRect(); // Popover dimensions

      var viewportHeight = window.innerHeight + window.scrollY; // Full viewport height (including scroll)

      var parentWrapper = popoverBody.closest('.popover-wrapper'); // Find the closest popover-wrapper

      var position = parentWrapper.dataset.position || 'top'; // Default to 'top' if no data-position
      // Determine the target positions

      var targetX = targetRect.left - popoverBody.offsetWidth + targetRect.width + window.scrollX;
      var targetY;

      if (position === 'bottom') {
        targetY = targetRect.bottom + window.scrollY + 10; // Bottom position with offset
        // If the popover overflows the bottom of the viewport, switch to top

        if (targetY + popoverRect.height > viewportHeight) {
          position = 'top';
          parentWrapper.dataset.position = 'top'; // Update dataset
        }
      }

      if (position === 'top') {
        targetY = targetRect.top - popoverRect.height + window.scrollY - 10; // Top position with offset
        // If the popover overflows the top of the viewport, switch to bottom

        if (targetY < window.scrollY) {
          position = 'bottom';
          parentWrapper.dataset.position = 'bottom'; // Update dataset
        }
      } // Adjust final Y position based on the resolved position


      targetY = position === 'bottom' ? targetRect.bottom + window.scrollY + 10 : targetRect.top - popoverRect.height + window.scrollY - 10; // Set the position

      popoverBody.style.position = "absolute";
      popoverBody.style.top = "".concat(targetY, "px");
      popoverBody.style.left = "".concat(targetX, "px"); // Check and adjust for right edge overflow

      var popoverRightEdge = targetX + popoverBody.offsetWidth;

      if (popoverRightEdge > window.innerWidth + window.scrollX) {
        popoverBody.style.left = "".concat(targetRect.left - popoverBody.offsetWidth + targetRect.width, "px");
      } // Check and adjust for left edge overflow


      var popoverLeftEdge = targetX;

      if (popoverLeftEdge < window.scrollX) {
        popoverBody.style.left = "10px";
      }
    }; // Set the initial position when the popover is created


    updatePopoverPosition(); // Adjust the position on window resize

    window.addEventListener("resize", updatePopoverPosition);
  },
  // Show the popover when clicking on the element with `data-target`
  openPopover: function openPopover() {
    var popoverTriggers = document.querySelectorAll("[data-popover-target]");
    popoverTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        var targetSelector = trigger.getAttribute("data-popover-target");
        var popoverWrapper = document.querySelector(targetSelector);
        var popoverBody = popoverWrapper.querySelector(".popover-body"); // Make the popover visible

        popoverWrapper.style.display = "block";
        Popover.setWidth(trigger, popoverBody);
        Popover.setPosition(trigger, popoverBody);
      });
    });
  },
  // Hide the popover when clicking the close button or outside the popover
  closePopover: function closePopover() {
    var popoverWrappers = document.querySelectorAll(".popover-wrapper");
    popoverWrappers.forEach(function (popoverWrapper) {
      var popoverBody = popoverWrapper.querySelector('.popover-body'); // Prevent the popover from closing when the popover body is clicked

      popoverBody.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent click from reaching the popoverWrapper
      });
      popoverWrapper.addEventListener("click", function (e) {
        Popover.handleClose(popoverWrapper);
      });
    });
  },
  handleClose: function handleClose(popoverWrapper) {
    popoverWrapper.style.display = "none";

    if (popoverWrapper.hasAttribute('data-download-target')) {
      popoverWrapper.removeAttribute('data-download-target'); // Remove the attribute
    }
  }
};
exports.Popover = Popover;
var Modal = {
  init: function init() {
    var modalNodeList = document.querySelectorAll(".modal-wrapper");

    if (modalNodeList.length) {
      Modal.openModal();
      Modal.closeModal();
    }
  },
  openModal: function openModal() {
    var modalTriggers = document.querySelectorAll("[data-modal-target]");
    modalTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        var targetSelector = trigger.getAttribute("data-modal-target");
        var modalWrapper = document.querySelector(targetSelector); // Remove fade-out class if present and add fade-in class

        modalWrapper.classList.remove("fade-out");
        modalWrapper.classList.add("fade-in"); // Display the modal

        modalWrapper.style.display = "block";
      });
    });
  },
  closeModal: function closeModal() {
    var modalWrappers = document.querySelectorAll(".modal-wrapper");
    modalWrappers.forEach(function (modalWrapper) {
      var modalBody = modalWrapper.querySelector('.modal-body'); // Prevent the modal from closing when the body is clicked

      modalBody.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      modalWrapper.addEventListener("click", function () {
        // Add fade-out class to trigger fade-out animation
        modalWrapper.classList.remove("fade-in");
        modalWrapper.classList.add("fade-out"); // Use a timeout to set `display: none` after the fade-out animation completes

        setTimeout(function () {
          modalWrapper.style.display = "none";
        }, 300); // Match this duration with your CSS transition duration
      });
    });
  }
};
exports.Modal = Modal;
var Drawer = {
  init: function init() {
    var drawerNodeList = document.querySelectorAll(".drawer-wrapper");

    if (drawerNodeList.length) {
      Drawer.openDrawer();
      Drawer.closeDrawer();
    }
  },
  openDrawer: function openDrawer() {
    var drawerTriggers = document.querySelectorAll("[data-drawer-target]");
    drawerTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        var targetSelector = trigger.getAttribute("data-drawer-target");
        var drawerWrapper = document.querySelector(targetSelector); // Remove fade-out class if present and add fade-in class

        drawerWrapper.classList.remove("slide-out");
        drawerWrapper.classList.add("slide-in"); // Display the modal

        drawerWrapper.style.display = "block";
      });
    });
  },
  closeDrawer: function closeDrawer(callback) {
    var drawerWrappers = document.querySelectorAll(".drawer-wrapper");
    drawerWrappers.forEach(function (drawerWrapper) {
      var drawerBody = drawerWrapper.querySelector('.drawer-body'); // Prevent the modal from closing when the body is clicked

      drawerBody.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      drawerWrapper.addEventListener("click", function () {
        // Add fade-out class to trigger fade-out animation
        drawerWrapper.classList.remove("slide-in");
        drawerWrapper.classList.add("slide-out"); // Use a timeout to set `display: none` after the fade-out animation completes

        setTimeout(function () {
          drawerWrapper.style.display = "none";

          if (callback) {
            callback(drawerWrapper); // Pass the current drawer wrapper to the callback
          }
        }, 300); // Match this duration with your CSS transition duration
      });
    });
  }
};
exports.Drawer = Drawer;
var Tab = {
  init: function init() {
    var tabWrappers = document.querySelectorAll(".tabs-wrapper");
    if (!tabWrappers.length) return;
    tabWrappers.forEach(function (wrapper) {
      var tabs = wrapper.querySelectorAll("button[data-tab-target]");
      var tabContents = wrapper.parentElement.querySelectorAll(".tab-content");

      if (tabs.length && tabContents.length) {
        // Set the first button and its corresponding tab-content to active
        tabs[0].classList.add("active");
        var firstTabContentId = tabs[0].getAttribute("data-tab-target");
        var firstTabContent = document.querySelector(firstTabContentId);

        if (firstTabContent) {
          firstTabContent.classList.add("active");
        }
      } // Add click event listeners for all tabs


      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          Tab.switchTab(tab, wrapper);
        });
      });
    });
  },
  switchTab: function switchTab(tab, wrapper) {
    // Remove active class from all tabs in the same wrapper
    var tabs = wrapper.querySelectorAll("button[data-tab-target]");
    tabs.forEach(function (t) {
      return t.classList.remove("active");
    }); // Add active class to the clicked tab

    tab.classList.add("active"); // Get the target tab content ID

    var targetSelector = tab.getAttribute("data-tab-target"); // Find and hide all tab-content elements in the same wrapper

    var tabContents = wrapper.parentElement.querySelectorAll(".tab-content");
    tabContents.forEach(function (content) {
      return content.classList.remove("active");
    }); // Show the corresponding tab-content

    var targetContent = document.querySelector(targetSelector);

    if (targetContent) {
      targetContent.classList.add("active");
    }
  }
};
exports.Tab = Tab;
var DataTable = {
  // Initialize the DataTable
  init: function init(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var columnDefs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var tableTitle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Table";
    var tableWrapper = document.querySelector(selector);

    if (!tableWrapper) {
      console.error("No element found for selector: ".concat(selector));
      return;
    } // Create a table element dynamically if not already present


    var table = tableWrapper.querySelector("table");

    if (!table) {
      table = document.createElement("table");
      table.classList.add("gts-dt-table"); // Add a class for styling

      tableWrapper.innerHTML = ""; // Clear the wrapper content

      tableWrapper.appendChild(table);
    } // Initialize the DataTable


    var tableApi = $(table).DataTable(_objectSpread({}, options, {
      dom: "<'dt-header' <'dt-filter' <'col gts-dt-length'l><'col dt-gts-search'f>>>" + "<'dt-body'<'col'tr>>" + "<'dt-footer'<'col'i><'col gts-paging'p>>",
      language: {
        emptyTable: "No data available",
        lengthMenu: "\n                  <span class=\"mat-icon material-symbols-sharp\">arrow_drop_down</span>\n                  <select class=\"custom-length-menu\" id=\"dt-length-0\">\n                      <option value=\"10\">10</option>\n                      <option value=\"25\">25</option>\n                      <option value=\"50\">50</option>\n                      <option value=\"100\">100</option>\n                  </select>\n              ",
        search: "" // Remove default search label

      },
      buttons: [{
        extend: 'print',
        text: '<span class="mat-icon material-symbols-sharp">print</span>',
        exportOptions: {
          stripHtml: false
        },
        customize: function customize(win, doc) {
          $(win.document.body).css('font-size', '10pt');
          $(win.document.body).find('table').css('font-size', 'inherit'); // Remove text content inside the mat-icon elements

          $(win.document.body).find('.mat-icon').each(function () {
            $(this).remove(); // Clear the text inside the .mat-icon span
          }); // Customize styles if needed

          $(win.document.body).find('.gts-dt-table').css('border', 'none');
          $(win.document.body).find('table').css('border-collapse', 'collapse'); // Prevent the black page from appearing

          $(win.document.body).css('visibility', 'visible'); // Ensure the content is visible immediately

          $(win.document.body).find('tbody td:last-child').each(function () {
            // Check if the <td> contains the "view" button
            if ($(this).find('button.view-more').length > 0) {
              $(this).remove(); // Add class only to the <td> with the button
            }
          });
        },
        autoPrint: true,
        printDelay: 500
      }, {
        extend: 'csvHtml5',
        text: 'Export CSV',
        filename: 'custom_filename',
        title: 'Custom Table Export'
      }, {
        extend: 'excelHtml5',
        text: 'Export Excel',
        filename: 'custom_filename',
        title: 'Custom Table Export'
      }, {
        extend: 'pdfHtml5',
        text: 'Export PDF',
        filename: 'custom_filename',
        title: 'Custom Table Export',
        exportOptions: {
          stripHtml: false,
          format: {
            header: function header(data, row, column, node) {
              if (typeof data === 'string') {
                data = data.replace(/<span class="mat-icon material-symbols-sharp">.*?<\/span>/g, '');
              }

              if (column.classList.contains('dt-orderable-none')) {
                data = ''; // Clear the cell's content for export

                column.remove();
              }

              return data;
            },
            body: function body(data, row, column, node) {
              if (typeof data === 'string') {
                data = data.replace(/<span class="mat-icon material-symbols-sharp">.*?<\/span>/g, '');
                var statusMatch = data.match(/<div class="status-dt">.*?<span.*?>(.*?)<\/span>.*?<\/div>/);

                if (statusMatch) {
                  data = statusMatch[1]; // Extract the inner content (e.g., Online or Offline)
                }
              } // Additional check: remove content for the last column if it contains "view-more"


              if (node && $(node).find('button.view-more').length > 0) {
                data = ''; // Clear the cell's content for export
              }

              return data; // Return the cleaned data
            }
          }
        },
        customize: function customize(doc) {// console.log('doc.pageSize', doc);
          // console.log('doc.pageMargins', doc.pageMargins);
        }
      }],
      columnDefs: columnDefs,
      initComplete: function initComplete() {
        // Add the custom table title
        var dtHeader = tableWrapper.querySelector(".dt-header");
        var titleDiv = document.createElement("div");
        titleDiv.className = "gts-db-title";
        titleDiv.innerHTML = "<h2>".concat(tableTitle, "</h2>");
        dtHeader.prepend(titleDiv);
        $(table).find('tbody td:last-child').each(function () {
          // Check if the <td> contains the "view" button
          if ($(this).find('button.view-more').length > 0) {
            $(this).addClass('view-details'); // Add class only to the <td> with the button
          }
        }); // Add Print button to the dt-filter

        var dtFilter = tableWrapper.querySelector(".dt-filter");

        if (dtFilter) {
          var dtFilterBtns = document.createElement("div");
          dtFilterBtns.classList.add('dt-ctrls'); // Print Button

          var printButton = document.createElement("button");
          printButton.className = "btn btn-icon";
          printButton.innerHTML = "<span class=\"mat-icon material-symbols-sharp\">print</span>";
          dtFilterBtns.prepend(printButton); // Add event listener for printing

          printButton.addEventListener("click", function () {
            tableApi.button('.buttons-print').trigger();
          }); // Export Button

          var exportButton = document.createElement("button");
          exportButton.className = "btn btn-icon";
          exportButton.setAttribute('data-popover-target', '#export-datatable');
          exportButton.innerHTML = "<span class=\"mat-icon material-symbols-sharp\">file_export</span>";
          dtFilterBtns.prepend(exportButton);
          dtFilter.prepend(dtFilterBtns);
        } // Customize the search field


        var searchWrapper = tableWrapper.querySelector(".dt-gts-search");

        if (searchWrapper) {
          var input = searchWrapper.querySelector("input");

          if (input) {
            // Add a placeholder to the search input
            input.setAttribute("placeholder", "Search here...");
          } // Add Material Icon for search


          var searchIcon = document.createElement("span");
          searchIcon.className = "mat-icon material-symbols-sharp";
          searchIcon.textContent = "search";
          searchWrapper.prepend(searchIcon);
        } // Replace sorting icons with Material Icons


        var headers = table.querySelectorAll("th:not(.dt-orderable-none)");
        headers.forEach(function (header, index) {
          if (index !== 0) {
            var icon = document.createElement("span");
            icon.className = "mat-icon material-symbols-sharp sort-icon";
            icon.textContent = "expand_all";
            header.appendChild(icon);
          }
        });
        this.api().on('responsive-resize', function (e, dt, columns) {
          // Apply the border-radius styles
          DataTable.applyBorderRadius(table);
          var firstTds = table.querySelectorAll('tbody tr:not(.child) td:first-child');

          if (firstTds.length) {
            firstTds.forEach(function (td) {
              // Check if the wrapper already exists
              var wrapperExists = td.querySelector('.flex-box');

              if (columns.includes(false) && !wrapperExists) {
                // If there's responsive hidden columns and the wrapper is not added yet
                var wrapper = document.createElement('div');
                wrapper.classList.add('flex-box');
                var span = document.createElement('span');
                span.classList.add('collapse-icon'); // Preserve the original content of the cell

                var tdValue = td.innerHTML;
                var textNode = document.createTextNode(tdValue); // Clear the cell and append new structure

                td.innerHTML = '';
                wrapper.appendChild(span);
                wrapper.appendChild(textNode);
                td.appendChild(wrapper);
              } else if (!columns.includes(false) && wrapperExists) {
                // If the table is no longer responsive and the wrapper exists, revert the changes
                var _wrapper = td.querySelector('.flex-box');

                var originalContent = _wrapper.textContent || _wrapper.innerText; // Replace the wrapper with the original content

                td.innerHTML = originalContent.trim();
              }
            });
          }
        });
        this.api().columns.adjust();
      }
    }));
    DataTable.exportDialog(tableApi);
    Popover.init();
    Button.init();
  },
  // Generate Popover
  exportDialog: function exportDialog(tableApi) {
    var popover = "\n        <div class=\"popover-body\">\n                <div class=\"popover-header\">\n                    <h3>Export Options</h3>\n                </div>\n                    \n                <div class=\"form-group\">\n                  <label for=\"fileName\">File Name</label>\n                  <input type=\"text\" id=\"fileName\" class=\"form-control\" placeholder=\"Enter file name (e.g., current_sites)\">\n                </div>\n                \n                <div class=\"form-group\">\n                  <label>Export DT Scope</label>\n                  <div class=\"flex-box export-select\">\n                    <input type=\"radio\" name=\"exportScope\" value=\"currentPage\" id=\"currentPage\" checked> <label for=\"currentPage\">Current</label><br>\n                    <input type=\"radio\" name=\"exportScope\" value=\"allData\" id=\"allData\"> <label for=\"allData\">All Data</label>\n                    <div class=\"switcher\"></div>\n                  </div>\n                </div>\n                \n                <div class=\"form-group\">\n                  <label>Export Format</label>\n                  <div class=\"flex-box export-type\">\n                    <button class=\"btn btn-primary export-btn\" data-format=\"pdf\">\n                    <div class=\"svg-icon\">\n                      <svg class=\"w-6 h-6 text-gray-800 dark:text-white\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" viewBox=\"0 0 24 24\">\n                        <path fill-rule=\"evenodd\" d=\"M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z\" clip-rule=\"evenodd\"/>\n                      </svg>\n                    </div>\n                    PDF</button>\n                    <button class=\"btn btn-primary export-btn\" data-format=\"xls\">\n                    <div class=\"svg-icon\">\n                      <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9 7V2.221C8.81533 2.31628 8.64664 2.43877 8.5 2.586L4.586 6.5C4.43912 6.64671 4.31598 6.8154 4.221 7H9ZM11 7V2H18C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V9C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H9C9.53043 9 10.0391 8.78929 10.4142 8.41421C10.7893 8.03914 11 7.53043 11 7ZM15.9263 18.3277C16.1871 18.3759 16.4403 18.4 16.6861 18.4C17.2746 18.4 17.755 18.2966 18.1275 18.0899C18.5074 17.8832 18.7867 17.618 18.9655 17.2941C19.1442 16.9634 19.2336 16.612 19.2336 16.2399C19.2336 15.8472 19.174 15.5165 19.0548 15.2478C18.9431 14.9791 18.7718 14.7448 18.5409 14.545C18.31 14.3383 18.0195 14.1385 17.6694 13.9455C17.3267 13.7526 17.0735 13.601 16.9096 13.4908C16.7457 13.3805 16.6377 13.2875 16.5856 13.2117C16.5409 13.1291 16.5185 13.0429 16.5185 12.9534C16.5185 12.6571 16.7606 12.5089 17.2448 12.5089C17.4087 12.5089 17.5763 12.5365 17.7476 12.5916C17.9189 12.6399 18.0716 12.6915 18.2057 12.7466C18.3472 12.7949 18.4478 12.819 18.5074 12.819C18.6191 12.819 18.7122 12.7535 18.7867 12.6226C18.8612 12.4917 18.917 12.3401 18.9543 12.1679C18.999 11.9887 19.0213 11.8372 19.0213 11.7131C19.0213 11.6236 18.9692 11.5478 18.8649 11.4858C18.7681 11.4169 18.675 11.3617 18.5856 11.3204C18.3993 11.2308 18.1684 11.155 17.8928 11.093C17.6172 11.031 17.3602 11 17.1219 11C16.3547 11 15.7513 11.186 15.3118 11.5581C14.8798 11.9233 14.6638 12.4297 14.6638 13.0774C14.6638 13.477 14.7308 13.8146 14.8649 14.0902C15.0064 14.3658 15.2038 14.607 15.4571 14.8137C15.7103 15.0204 16.0195 15.2202 16.3844 15.4131C16.7569 15.6061 17.0101 15.768 17.1442 15.8989C17.2783 16.0229 17.3453 16.1676 17.3453 16.333C17.3453 16.6912 17.0995 16.8704 16.6079 16.8704C16.3919 16.8704 16.1796 16.8359 15.971 16.767C15.7625 16.6981 15.5763 16.6292 15.4124 16.5603C15.256 16.4914 15.1442 16.457 15.0772 16.457C14.958 16.457 14.8612 16.5293 14.7867 16.674C14.7122 16.8118 14.6563 16.9737 14.6191 17.1598C14.5818 17.3389 14.5632 17.4905 14.5632 17.6145C14.5632 17.7179 14.6303 17.8109 14.7643 17.8936C14.8984 17.9763 15.0586 18.0555 15.2448 18.1313C15.4385 18.214 15.6656 18.2794 15.9263 18.3277ZM11.2927 18.3173C10.8458 18.3173 10.6223 18.1795 10.6223 17.9039V11.5064C10.6223 11.3686 10.6931 11.2618 10.8346 11.186C10.9761 11.1033 11.2033 11.062 11.5162 11.062H11.7285C12.0413 11.062 12.2685 11.1033 12.41 11.186C12.5516 11.2618 12.6223 11.3686 12.6223 11.5064V16.55H13.9519C14.2499 16.55 14.3989 16.7567 14.3989 17.1701V17.6972C14.3989 18.1106 14.2499 18.3173 13.9519 18.3173H11.2927ZM5.1676 18.2863C5.27933 18.3208 5.49534 18.338 5.81564 18.338H6.18436C6.46741 18.338 6.6648 18.3104 6.77654 18.2553C6.89572 18.2002 6.98138 18.0968 7.03352 17.9452L7.73743 15.7128L8.3743 17.9556C8.41155 18.1072 8.48603 18.2105 8.59777 18.2656C8.71695 18.3139 8.92551 18.338 9.22346 18.338H9.61453C9.96462 18.338 10.1881 18.3173 10.2849 18.276C10.3892 18.2346 10.4413 18.1623 10.4413 18.0589C10.4413 18.0245 10.4302 17.9762 10.4078 17.9142C10.3929 17.8522 10.3594 17.7489 10.3073 17.6042L9.26816 14.5863L10.2737 11.7028C10.311 11.5994 10.3371 11.5236 10.352 11.4754C10.3669 11.4203 10.3743 11.3755 10.3743 11.3411C10.3743 11.155 10.1546 11.062 9.71508 11.062H9.21229C8.98138 11.062 8.79516 11.0792 8.65363 11.1137C8.5121 11.1412 8.42272 11.2239 8.38548 11.3617L7.7933 13.5321L7.22346 11.4444C7.17132 11.2653 7.07449 11.1585 6.93296 11.124C6.79888 11.0827 6.62384 11.062 6.40782 11.062H5.86034C5.37616 11.062 5.13408 11.1585 5.13408 11.3514C5.13408 11.3996 5.14153 11.4547 5.15642 11.5167C5.17132 11.5788 5.18994 11.6442 5.21229 11.7131L6.2514 14.5656L5.1676 17.5112C5.05587 17.8212 5 18.0073 5 18.0693C5 18.1726 5.05587 18.245 5.1676 18.2863Z\" fill=\"black\"/>\n                      </svg>\n                    </div>\n                    XLS</button>\n                    <button class=\"btn btn-primary export-btn\" data-format=\"csv\">\n                    <div class=\"svg-icon\">\n                      <svg class=\"w-6 h-6 text-gray-800 dark:text-white\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" viewBox=\"0 0 24 24\">\n                        <path fill-rule=\"evenodd\" d=\"M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm1.018 8.828a2.34 2.34 0 0 0-2.373 2.13v.008a2.32 2.32 0 0 0 2.06 2.497l.535.059a.993.993 0 0 0 .136.006.272.272 0 0 1 .263.367l-.008.02a.377.377 0 0 1-.018.044.49.49 0 0 1-.078.02 1.689 1.689 0 0 1-.297.021h-1.13a1 1 0 1 0 0 2h1.13c.417 0 .892-.05 1.324-.279.47-.248.78-.648.953-1.134a2.272 2.272 0 0 0-2.115-3.06l-.478-.052a.32.32 0 0 1-.285-.341.34.34 0 0 1 .344-.306l.94.02a1 1 0 1 0 .043-2l-.943-.02h-.003Zm7.933 1.482a1 1 0 1 0-1.902-.62l-.57 1.747-.522-1.726a1 1 0 0 0-1.914.578l1.443 4.773a1 1 0 0 0 1.908.021l1.557-4.773Zm-13.762.88a.647.647 0 0 1 .458-.19h1.018a1 1 0 1 0 0-2H6.647A2.647 2.647 0 0 0 4 13.647v1.706A2.647 2.647 0 0 0 6.647 18h1.018a1 1 0 1 0 0-2H6.647A.647.647 0 0 1 6 15.353v-1.706c0-.172.068-.336.19-.457Z\" clip-rule=\"evenodd\"/>\n                      </svg>\n                    </div>\n                    CSV</button>\n                  </div>\n                </div>\n        </div>\n    ";
    var isExportPopover = document.querySelector('#export-datatable');

    if (!isExportPopover) {
      var popoverWrapper = document.createElement('div');
      popoverWrapper.classList.add('popover-wrapper');
      popoverWrapper.id = 'export-datatable';
      popoverWrapper.setAttribute('data-position', 'bottom');
      popoverWrapper.innerHTML = popover;
      document.body.appendChild(popoverWrapper);
      DataTable.handleExport(tableApi, popoverWrapper);
    }
  },
  // Export Functions
  handleExport: function handleExport(tableApi, popoverWrapper) {
    if (popoverWrapper) {
      var exportFileNameInput = popoverWrapper.querySelector('#fileName');
      var exportScopeSelection = popoverWrapper.querySelectorAll('input[name="exportScope"]');
      var fileName = 'site_exported_data';
      var exportScope = 'currentPage'; // Attach change event listener for file name

      if (exportFileNameInput) {
        exportFileNameInput.addEventListener('input', function (e) {
          fileName = e.target.value.trim() || 'exported_data'; // console.log('Updated fileName:', fileName);
        });
      } // Attach change event listener for export scope


      exportScopeSelection.forEach(function (radio) {
        radio.addEventListener('change', function (e) {
          if (e.target.checked) {
            exportScope = e.target.value; // console.log('Updated exportScope:', exportScope);
          }
        });
      }); // Attach click listeners to export buttons

      var exportButtons = popoverWrapper.querySelectorAll('.export-btn');
      exportButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var format = button.dataset.format;

          switch (format) {
            case 'pdf':
              DataTable.exportToPDF(tableApi, fileName, exportScope);
              break;

            case 'xls':
              DataTable.exportToXLS(tableApi, fileName, exportScope);
              break;

            case 'csv':
              DataTable.exportToCSV(tableApi, fileName, exportScope);
              break;

            default:
              console.error('Unsupported format');
          }
        });
      });
    }
  },
  modifyExport: {
    columns: function columns(columnIdx, data, node) {
      // Exclude columns based on custom conditions
      if (node.classList.contains('dt-orderable-none')) {
        return false; // Exclude this column from the export
      }

      if ($(node).find('button.view-more').length > 0) {
        return false; // Exclude column with "view-more" button
      }

      return true; // Include all other columns
    },
    header: function header(data, row, column, node) {
      if (typeof data === 'string') {
        // Remove specific span tags
        data = data.replace(/<span class="mat-icon material-symbols-sharp">.*?<\/span>/g, '');
      } // Clear content for specific columns


      if (column && column.classList && column.classList.contains('dt-orderable-none')) {
        data = ''; // Clear the cell's content for export

        return false;
      }

      return data;
    },
    body: function body(data, row, column, node) {
      if (typeof data === 'string') {
        // Remove specific span tags
        data = data.replace(/<span class="mat-icon material-symbols-sharp">.*?<\/span>/g, ''); // Extract inner content from status-dt div

        var statusMatch = data.match(/<div class="status-dt">.*?<span.*?>(.*?)<\/span>.*?<\/div>/);

        if (statusMatch) {
          data = statusMatch[1]; // Extract the inner content (e.g., Online or Offline)
        }
      } // Additional check: remove content for the last column if it contains "view-more"


      if (node && $(node).find('button.view-more').length > 0) {
        data = ''; // Clear the cell's content for export

        return false;
      }

      return data; // Return the cleaned data
    }
  },
  exportToPDF: function exportToPDF(tableApi, fileName, exportScope) {
    var button = tableApi.button('.buttons-pdf'); // Override action function

    button.action(function (e, dt, button, config) {
      // Update file name
      config.title = fileName;
      config.filename = fileName; // Set export options based on the export scope

      switch (exportScope) {
        case 'currentPage':
          config.exportOptions = {
            modifier: {
              page: 'current'
            }
          }; // Export current page

          break;

        case 'selectedRows':
          config.exportOptions = {
            modifier: {
              selected: true
            }
          }; // Export selected rows

          break;

        case 'allData':
          config.exportOptions = {
            modifier: {
              page: 'all'
            }
          }; // Export all data

          break;

        default:
          console.error('Invalid export scope');
          return;
      }

      config.exportOptions = _objectSpread({}, config.exportOptions, {
        // Preserve existing options
        columns: DataTable.modifyExport.columns,
        format: {
          header: DataTable.modifyExport.header,
          body: DataTable.modifyExport.body
        }
      }); // Use the built-in export function

      $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
    }); // Trigger the export

    button.trigger();
  },
  exportToXLS: function exportToXLS(tableApi, fileName, exportScope) {
    var button = tableApi.button('.buttons-excel'); // Override action function

    button.action(function (e, dt, button, config) {
      try {
        // Update file name
        config.title = fileName;
        config.filename = fileName; // Set export options based on the export scope

        switch (exportScope) {
          case 'currentPage':
            config.exportOptions = {
              modifier: {
                page: 'current'
              }
            }; // Export current page

            break;

          case 'selectedRows':
            config.exportOptions = {
              modifier: {
                selected: true
              }
            }; // Export selected rows

            break;

          case 'allData':
            config.exportOptions = {
              modifier: {
                page: 'all'
              }
            }; // Export all data

            break;

          default:
            console.error('Invalid export scope');
            return;
        }

        config.exportOptions = _objectSpread({}, config.exportOptions, {
          // Preserve existing options
          columns: DataTable.modifyExport.columns,
          format: {
            header: DataTable.modifyExport.header,
            body: DataTable.modifyExport.body
          }
        }); // Use the built-in export function

        $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
      } catch (err) {
        console.error('Export action error:', err);
      }
    }); // Trigger the export

    button.trigger();
  },
  exportToCSV: function exportToCSV(tableApi, fileName, exportScope) {
    var button = tableApi.button('.buttons-csv'); // Override action function

    button.action(function (e, dt, button, config) {
      try {
        // Update file name
        config.title = fileName;
        config.filename = fileName; // Set export options based on the export scope

        switch (exportScope) {
          case 'currentPage':
            config.exportOptions = {
              modifier: {
                page: 'current'
              }
            }; // Export current page

            break;

          case 'selectedRows':
            config.exportOptions = {
              modifier: {
                selected: true
              }
            }; // Export selected rows

            break;

          case 'allData':
            config.exportOptions = {
              modifier: {
                page: 'all'
              }
            }; // Export all data

            break;

          default:
            console.error('Invalid export scope');
            return;
        }

        config.exportOptions = _objectSpread({}, config.exportOptions, {
          // Preserve existing options
          columns: DataTable.modifyExport.columns,
          format: {
            header: DataTable.modifyExport.header,
            body: DataTable.modifyExport.body
          }
        }); // Use the built-in export function

        $.fn.dataTable.ext.buttons.csvHtml5.action.call(this, e, dt, button, config);
      } catch (err) {
        console.error('Export action error:', err);
      }
    }); // Trigger the export

    button.trigger();
  },
  // Fetch Data for the DataTable
  fetchData: function fetchData(url) {
    var response, data;
    return regeneratorRuntime.async(function fetchData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch(url));

          case 3:
            response = _context.sent;
            _context.next = 6;
            return regeneratorRuntime.awrap(response.json());

          case 6:
            data = _context.sent;
            return _context.abrupt("return", data);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error("Error fetching data for DataTable:", _context.t0);
            return _context.abrupt("return", []);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // Apply Border Radius to Specific Cells
  applyBorderRadius: function applyBorderRadius(table) {
    // Reset previous styles
    table.querySelectorAll('th, td').forEach(function (cell) {
      cell.style.borderTopLeftRadius = '';
      cell.style.borderTopRightRadius = '';
      cell.style.borderBottomLeftRadius = '';
      cell.style.borderBottomRightRadius = '';
    }); // Handle first row (header)

    var firstRow = table.querySelector('thead tr');

    if (firstRow) {
      var ths = Array.from(firstRow.querySelectorAll('th')).filter(function (th) {
        return !th.classList.contains('dtr-hidden');
      });

      if (ths.length > 0) {
        ths[0].style.borderTopLeftRadius = 'var(--gts-sm-curve)'; // First visible <th>

        ths[ths.length - 1].style.borderTopRightRadius = 'var(--gts-sm-curve)'; // Last visible <th>
      }
    } // Handle last row (footer or body)


    var lastRow = table.querySelector('tbody tr:last-child');

    if (lastRow) {
      var tds = Array.from(lastRow.querySelectorAll('td')).filter(function (td) {
        return !td.classList.contains('dtr-hidden');
      });

      if (tds.length > 0) {
        tds[0].style.borderBottomLeftRadius = 'var(--gts-sm-curve)'; // First visible <td>

        tds[tds.length - 1].style.borderBottomRightRadius = 'var(--gts-sm-curve)'; // Last visible <td>
      }
    }
  }
};
exports.DataTable = DataTable;
var DatatableFilter = {
  init: function init(wrapper, response, filterOptions, FilterFn, DTableFn) {
    var resolver;
    return regeneratorRuntime.async(function init$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve) {
              resolver = resolve; // Set the resolver on the first call

              var renderFilters = function renderFilters() {
                // Create a wrapper div for all filter items
                var filterItemsWrapper = document.createElement('div');
                filterItemsWrapper.classList.add('datatable-filter-items'); // Loop through filter categories and create select dropdowns

                Object.entries(filterOptions).forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      filterKey = _ref2[0],
                      _ref2$ = _ref2[1],
                      options = _ref2$.options,
                      originalKey = _ref2$.originalKey;

                  var filterDiv = document.createElement('div');
                  filterDiv.classList.add('filter-item');
                  var label = document.createElement('label');
                  label.setAttribute('for', filterKey);
                  label.textContent = filterKey.charAt(0).toUpperCase() + filterKey.slice(1).replace(/([A-Z])/g, ' $1');
                  filterDiv.appendChild(label);
                  var formItem = document.createElement('div');
                  formItem.classList.add('form-item'); // Add dropdown or date pickers

                  if (originalKey === 'time') {
                    var dataPickerFrom = document.createElement('input');
                    dataPickerFrom.id = 'filterDateFrom';
                    dataPickerFrom.type = 'text';
                    dataPickerFrom.name = 'filterDateFrom';
                    dataPickerFrom.placeholder = 'From';
                    var dataPickerTo = document.createElement('input');
                    dataPickerTo.id = 'filterDateTo';
                    dataPickerTo.type = 'text';
                    dataPickerTo.name = 'filterDateTo';
                    dataPickerTo.placeholder = 'To';
                    filterDiv.classList.add('data-picker-wrapper');
                    formItem.appendChild(dataPickerFrom);
                    formItem.appendChild(dataPickerTo); // Initialize date pickers
                  } else {
                    var select = document.createElement('select');
                    select.id = originalKey;
                    select.name = originalKey;
                    select.setAttribute('multiple', 'multiple');
                    select.classList.add('custom-select', 'js-example-basic-multiple');
                    options.forEach(function (option) {
                      var optionElement = document.createElement('option');
                      optionElement.value = option;
                      optionElement.textContent = option;
                      select.appendChild(optionElement);
                    });
                    formItem.appendChild(select);
                  }

                  filterDiv.appendChild(formItem);
                  filterItemsWrapper.appendChild(filterDiv);
                });

                if (wrapper) {
                  wrapper.innerHTML = '';
                  wrapper.appendChild(filterItemsWrapper);
                } else {
                  console.error('No element with id #dtFilterWrapper found.');
                } // Create and append the submit and clear buttons


                var filterButtonDiv = document.createElement('div');
                filterButtonDiv.classList.add('filter-button');
                var filterButton = document.createElement('button');
                filterButton.classList.add('btn');
                filterButton.id = 'filterButton';
                filterButton.textContent = 'Apply Filters';
                var clearButton = document.createElement('button');
                clearButton.classList.add('clear', 'btn');
                clearButton.textContent = 'Clear';
                clearButton.addEventListener('click', function () {
                  wrapper.innerHTML = '';
                  DatatableFilter.init(wrapper, response, filterOptions, FilterFn, DTableFn);
                  FilterFn.state.selectedFilters = response;
                  DTableFn.init(response);
                });
                filterButtonDiv.appendChild(clearButton);
                filterButtonDiv.appendChild(filterButton);
                wrapper.appendChild(filterButtonDiv); // Click event to apply filters

                filterButton.addEventListener('click', function () {
                  var selectedFilters = {}; // Collect selected options for filters

                  document.querySelectorAll('.datatable-filter-items select').forEach(function (select) {
                    var selectedOptions = Array.from(select.selectedOptions).map(function (option) {
                      return option.value;
                    });

                    if (selectedOptions.length > 0) {
                      selectedFilters[select.name] = selectedOptions;
                    }
                  }); // Handle date filters

                  var fromDate = document.querySelector('#filterDateFrom').value;
                  var toDate = document.querySelector('#filterDateTo').value;

                  if (fromDate || toDate) {
                    selectedFilters['time'] = {
                      from: fromDate,
                      to: toDate
                    };
                  }

                  FilterFn.state.selectedFilters = selectedFilters;
                  FilterFn.filterSubmit(selectedFilters);
                  resolver(selectedFilters); // Resolve the promise with the filters
                });
              };

              renderFilters(); // Render filters for the first time

              DatePicker.init();
              Select.init();
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};
exports.DatatableFilter = DatatableFilter;
var Select = {
  init: function init() {
    // const customelect = document.querySelector('.custom-select');
    var customSelect = $('.custom-select');

    if (customSelect) {
      customSelect.select2({
        placeholder: "Select a state"
      });
      console.log('True');
    }
  }
};
exports.Select = Select;
var DatePicker = {
  init: function init() {
    var dateFormat = "m/d/Y H:i"; // Flatpickr format for mm/dd/yyyy hh:mm

    var filterDateFrom = document.getElementById("filterDateFrom");
    var filterDateTo = document.getElementById("filterDateTo");

    if (filterDateFrom && filterDateTo) {
      // Utility function to format the date in the desired format (if needed)
      var formatDate = function formatDate(date) {
        var parsedDate = new Date(date);
        var month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        var day = String(parsedDate.getDate()).padStart(2, "0");
        var year = parsedDate.getFullYear();
        var hours = String(parsedDate.getHours()).padStart(2, "0");
        var minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        return "".concat(month, "/").concat(day, "/").concat(year, " ").concat(hours, ":").concat(minutes);
      }; // Optional: Add event listeners for additional actions on date changes


      // Initialize Flatpickr for "From" date
      var fromPicker = flatpickr(filterDateFrom, {
        enableTime: true,
        dateFormat: dateFormat,
        onChange: function onChange(selectedDates, dateStr) {
          if (selectedDates.length > 0) {
            // Set the minimum date for the "To" date picker
            toPicker.set("minDate", selectedDates[0]);
          }
        }
      }); // Initialize Flatpickr for "To" date

      var toPicker = flatpickr(filterDateTo, {
        enableTime: true,
        dateFormat: dateFormat,
        onChange: function onChange(selectedDates, dateStr) {
          if (selectedDates.length > 0) {
            // Set the maximum date for the "From" date picker
            fromPicker.set("maxDate", selectedDates[0]);
          }
        }
      });
      filterDateFrom.addEventListener("change", function () {
        console.log("From Date Selected:", formatDate(this.value));
      });
      filterDateTo.addEventListener("change", function () {
        console.log("To Date Selected:", formatDate(this.value));
      });
    }
  }
};
exports.DatePicker = DatePicker;